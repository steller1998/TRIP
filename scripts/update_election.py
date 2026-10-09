import json, re, urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

URL = "https://results.eci.gov.in/ResultPcByeOct2026/ConstituencywiseS039.htm"
TARGETS = {
    "bjp": "devasish sharma",
    "aiudf": "mohammed badruddin ajmal",
    "inc": "sibamoni bora",
}

class Rows(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell = [], None, None
    def handle_starttag(self, tag, attrs):
        if tag == "tr": self.row = []
        elif tag in ("td", "th") and self.row is not None: self.cell = []
    def handle_data(self, data):
        if self.cell is not None: self.cell.append(data)
    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split())); self.cell = None
        elif tag == "tr" and self.row is not None:
            if self.row: self.rows.append(self.row)
            self.row = None

request = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(request, timeout=25) as response:
    page = response.read().decode("utf-8", errors="replace")

parser = Rows()
parser.feed(page)
found = {}
for row in parser.rows:
    text = " | ".join(row).lower()
    for key, name in TARGETS.items():
        if name in text:
            nums = [int(re.sub(r"[^0-9]", "", cell)) for cell in row if re.sub(r"[^0-9]", "", cell)]
            # ECI candidate rows normally end with the total-vote cell.
            if nums:
                value = nums[-1]
                if 0 <= value <= 2000000:
                    found[key] = {"name": name.title(), "party": key.upper(), "votes": value}

if set(found) != set(TARGETS):
    raise SystemExit("Could not verify all candidate rows on ECI page; saved data left unchanged.")
if all(item["votes"] == 0 for item in found.values()):
    raise SystemExit("ECI returned zero for every candidate; saved data left unchanged.")

payload = {
    "source": "Election Commission of India",
    "source_url": URL,
    "last_checked_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    "source_updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    "status": "auto_checked",
    "candidates": found
}
Path("election-data.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
print("Election data updated from ECI.")
