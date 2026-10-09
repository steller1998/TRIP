import json
import re
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

URL = "https://results.eci.gov.in/ResultPcByeOct2026/ConstituencywiseS039.htm"
TARGETS = {
    "bjp": ("devasish sharma", "Devasish Sharma", "BJP"),
    "aiudf": ("mohammed badruddin ajmal", "Mohammed Badruddin Ajmal", "AIUDF"),
    "inc": ("sibamoni bora", "Sibamoni Bora", "INC"),
}

def clean(value):
    return " ".join((value or "").split())

def parse_int(value):
    digits = re.sub(r"[^0-9]", "", value or "")
    return int(digits) if digits else None

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.row = None
        self.cell = None
        self.cell_tag = None
    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell, self.cell_tag = [], tag
    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)
    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(clean("".join(self.cell)))
            self.cell, self.cell_tag = None, None
        elif tag == "tr" and self.row is not None:
            if self.row:
                self.rows.append(self.row)
            self.row = None

request = urllib.request.Request(URL, headers={
    "User-Agent": "Mozilla/5.0 (compatible; NagaonElectionTracker/1.0)",
    "Accept": "text/html"
})
with urllib.request.urlopen(request, timeout=30) as response:
    if response.status != 200:
        raise SystemExit(f"ECI returned HTTP {response.status}")
    page = response.read().decode("utf-8", errors="replace")

parser = TableParser()
parser.feed(page)
headers = []
found = {}
for row in parser.rows:
    normalized = [clean(c).lower() for c in row]
    if any("candidate" in c for c in normalized) and any("total" in c and "vote" in c for c in normalized):
        headers = normalized
        continue
    joined = " | ".join(normalized)
    for key, (needle, display_name, party) in TARGETS.items():
        if needle not in joined:
            continue
        total_index = next((i for i, h in enumerate(headers) if "total" in h and "vote" in h), None)
        # Only use the historical ECI column position if no readable header exists.
        if total_index is None and len(row) == 7:
            total_index = 5
        value = parse_int(row[total_index]) if total_index is not None and total_index < len(row) else None
        if value is not None and 0 <= value <= 2_000_000:
            found[key] = {"name": display_name, "party": party, "votes": value}

if set(found) != set(TARGETS):
    missing = sorted(set(TARGETS) - set(found))
    raise SystemExit(f"Could not verify candidate totals from ECI table (missing: {missing}); saved data left unchanged.")
if len({item["votes"] for item in found.values()}) < 2 or all(item["votes"] == 0 for item in found.values()):
    raise SystemExit("ECI values failed sanity checks; saved data left unchanged.")

checked = datetime.now(timezone.utc).isoformat(timespec="seconds")
payload = {
    "source": "Election Commission of India",
    "source_url": URL,
    "last_checked_utc": checked,
    "status": "auto_checked",
    "candidates": found
}
Path("election-data.json").write_text(json.dumps(payload, indent=2) + chr(10), encoding="utf-8")
print("Verified ECI candidate totals:", {key: item["votes"] for key, item in found.items()})
print("Check time (UTC):", checked)
