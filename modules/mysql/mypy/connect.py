# MySQL Python Javascript connector 
import sys
import os
import json
# Checks if connection is possible (credentials ok, etc) #
def readjson(fname):
  json_data=open(fname)
  data = json.load(json_data)
  return data
# reads in cnfg.json #
config = readjson(os.path.dirname(os.path.realpath(__file__))+"/config.json")
try:
  import pymysql
except Exception as e:
  print("PyMySQL is not installed - returning")
  sys.exit()
try:
  conn = pymysql.connect(host=config['hostname'], port=3306, user=config['user'], passwd=config["pw"], db=config["db"])
except pymysql.err.OperationalError:
  print(0)
  sys.exit()
print(1)
 