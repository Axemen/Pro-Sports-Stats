import urllib, json
url = "https://gist.githubusercontent.com/the55/2155142/raw/30a251395cd3c04771f29f2a6295fc8849b73d11/mlb_stadium.json"
response = urllib.urlopen(url)
data = json.loads(response.read())
print data

