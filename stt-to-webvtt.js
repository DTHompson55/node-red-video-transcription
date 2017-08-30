[{"id":"9bb6fe14.7782b","type":"function","z":"ed632ead.123c4","name":"Webvtt Formatter","func":"var ts = msg.payload;\nvar timer = 0\nvar starttimer = 0;\nvar endtimer = 1;\nvar frame = 0;\nvar vtt = \"WEBVTT\\n\\n\";\n\nvar rW = ts.results[0].alternatives[0].timestamps;\n\nfunction timeFmt(f){\nvar\ti = Math.floor(f);\nvar ms = (\"\"+(f-i).toPrecision(2)).substring(2);\nvar\ts = i%60;\nvar\tm = (Math.floor(i/60))%60;\nvar\th = Math.floor(i/3600);\n\treturn \"\"+((h<10)?\"0\"+h:h)+\":\" +((m<10)?\"0\"+m:m)+\":\" +((s<10)?\"0\"+s:s)+\".\"+ms;\n}\n\nvar frame = 0;\nvar start_time = 0;\n//\n// strip out all the timestamp elements into an array\n//\nvar a = ts.results.map(function (element){\n\treturn element.alternatives[0].timestamps;\n}).reduce(function(pv,el){\n\tel.map(function(element){\n\t\treturn(element);\n\t}).reduce(function(pv,el){\n\t\treturn pv.concat(el);\n\t},[]);\n\treturn pv.concat(el);\n},[]);\n//\n// take all the timestamps and format them as SRT elements\n//\nvar b = a.map(function(element){\n\treturn (element);\n}).reduce(function(pv,el){\t\n\tif ( el[0] == \"%HESITATION\") return(pv);\n\tif (! pv[frame] ) {\n\tstart_time = parseFloat(el.start);\n\tpv[frame] = {words:\"\",start:el[1], end:el[2], frame:frame};\n\t start_time = el[1];\n\t end_time = start_time + 2.0;\n\t} else{\n\tpv[frame].words+= \" \";\n}\npv[frame].words+= el[0];\npv[frame].end = el[2];\nif (parseFloat(el[2])>end_time){\n\tend_time = parseFloat(el.end);\n\tframe++;\n}\nreturn(pv);\n},[]);\n\nvar c = b.map(function(el){\n\tvtt+= el.frame + \"\\n\";\n\tvtt+= timeFmt(el.start)+\" --> \"+timeFmt(el.end) + \"\\n\";\n\tvtt+= el.words+ \"\\n\\n\";\n});\nmsg.payload = vtt;\nreturn msg;","outputs":1,"noerr":0,"x":395.5170440673828,"y":453.6589984893799,"wires":[["6ca4915a.e3548","c2f693d9.45ecb"]]}]