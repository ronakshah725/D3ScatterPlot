#!/bin/sh
python -m SimpleHTTPServer $1 & 
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --new-window http://localhost:$1
