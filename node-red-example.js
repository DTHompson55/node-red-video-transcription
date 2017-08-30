[{"id":"37dd2e6f.8bc652","type":"ffmpeg-conversion","z":"ed632ead.123c4","name":"","format":"wav","audiochannels":"mono","x":129.50845336914062,"y":330.6618604660034,"wires":[["a789d42b.84ad98"]]},{"id":"e0493339.9cceb","type":"file in","z":"ed632ead.123c4","name":"File Reader","filename":"","format":"","x":114.51414489746094,"y":252.42326164245605,"wires":[["37dd2e6f.8bc652"]]},{"id":"7d726be8.a1f7e4","type":"debug","z":"ed632ead.123c4","name":"","active":true,"console":"false","complete":"true","x":668.519889831543,"y":563.7669105529785,"wires":[]},{"id":"a789d42b.84ad98","type":"function","z":"ed632ead.123c4","name":"Prepare For STT Service","func":"msg.headers = {'Content-Type' : 'audio/wav'};\nmsg.url=\"https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&continuous=true\";\nreturn msg;","outputs":1,"noerr":0,"x":403.0142364501953,"y":332.0056276321411,"wires":[["ed6f5be5.30fa08"]]},{"id":"ed6f5be5.30fa08","type":"http request","z":"ed632ead.123c4","name":"STT Service","method":"POST","ret":"obj","url":"","tls":"","x":137.0142059326172,"y":454.99989128112793,"wires":[["9bb6fe14.7782b","c94282de.30099"]]},{"id":"c2f693d9.45ecb","type":"file","z":"ed632ead.123c4","name":"STT Out","filename":"/Users/DanT/Projects/stt.txt","appendNewline":true,"createDir":false,"overwriteFile":"true","x":685.5141944885254,"y":457.4146795272827,"wires":[]},{"id":"22b0923b.fb851e","type":"http in","z":"ed632ead.123c4","name":"","url":"/api/webvtt","method":"get","swaggerDoc":"","x":107.51988220214844,"y":67.88919162750244,"wires":[["3a5df2c2.ee7b0e","a8644b82.2e5d68","f4f67ce4.ac7e"]]},{"id":"bcd3b369.a98e8","type":"http response","z":"ed632ead.123c4","name":"","x":518.5142364501953,"y":68.72730541229248,"wires":[]},{"id":"3a5df2c2.ee7b0e","type":"function","z":"ed632ead.123c4","name":"adjust payload","func":"msg.filename = msg.payload.filename;\nmsg.respendpoint = msg.payload.respendpoint;\nmsg.correlationId = msg.payload.correlationId;\n\n\nreturn msg;","outputs":1,"noerr":0,"x":113.50853729248047,"y":185.65907859802246,"wires":[["e0493339.9cceb"]]},{"id":"a8644b82.2e5d68","type":"function","z":"ed632ead.123c4","name":"Return Status","func":"msg.payload = {\"file_200\":\"OK\"};\nmsg.payload = \"\";\n//msg.headers = {\"Content-Type\":\"text/plain\",\"Accept\": \"text/plain\"};\nmsg.headers = {\"Content-Type\":\"application/json\",\"Accept\": \"application/json\"};\n//msg.headers = {\"Content-Type\":\"application/xml\",\"Accept\": \"application/xml\"};\nreturn msg;","outputs":1,"noerr":0,"x":326.51988983154297,"y":68.66192817687988,"wires":[["bcd3b369.a98e8"]]},{"id":"9bb6fe14.7782b","type":"function","z":"ed632ead.123c4","name":"Webvtt Formatter","func":"var ts = msg.payload;\nvar timer = 0\nvar starttimer = 0;\nvar endtimer = 1;\nvar frame = 0;\nvar vtt = \"WEBVTT\\n\\n\";\n\nvar rW = ts.results[0].alternatives[0].timestamps;\n\nfunction timeFmt(f){\nvar\ti = Math.floor(f);\nvar ms = (\"\"+(f-i).toPrecision(2)).substring(2);\nvar\ts = i%60;\nvar\tm = (Math.floor(i/60))%60;\nvar\th = Math.floor(i/3600);\n\treturn \"\"+((h<10)?\"0\"+h:h)+\":\" +((m<10)?\"0\"+m:m)+\":\" +((s<10)?\"0\"+s:s)+\".\"+ms;\n}\n\nvar frame = 0;\nvar start_time = 0;\n//\n// strip out all the timestamp elements into an array\n//\nvar a = ts.results.map(function (element){\n\treturn element.alternatives[0].timestamps;\n}).reduce(function(pv,el){\n\tel.map(function(element){\n\t\treturn(element);\n\t}).reduce(function(pv,el){\n\t\treturn pv.concat(el);\n\t},[]);\n\treturn pv.concat(el);\n},[]);\n//\n// take all the timestamps and format them as SRT elements\n//\nvar b = a.map(function(element){\n\treturn (element);\n}).reduce(function(pv,el){\t\n\tif ( el[0] == \"%HESITATION\") return(pv);\n\tif (! pv[frame] ) {\n\tstart_time = parseFloat(el.start);\n\tpv[frame] = {words:\"\",start:el[1], end:el[2], frame:frame};\n\t start_time = el[1];\n\t end_time = start_time + 2.0;\n\t} else{\n\tpv[frame].words+= \" \";\n}\npv[frame].words+= el[0];\npv[frame].end = el[2];\nif (parseFloat(el[2])>end_time){\n\tend_time = parseFloat(el.end);\n\tframe++;\n}\nreturn(pv);\n},[]);\n\nvar c = b.map(function(el){\n\tvtt+= el.frame + \"\\n\";\n\tvtt+= timeFmt(el.start)+\" --> \"+timeFmt(el.end) + \"\\n\";\n\tvtt+= el.words+ \"\\n\\n\";\n});\nmsg.payload = vtt;\nreturn msg;","outputs":1,"noerr":0,"x":395.5170440673828,"y":453.6589984893799,"wires":[["6ca4915a.e3548","c2f693d9.45ecb"]]},{"id":"f4f67ce4.ac7e","type":"debug","z":"ed632ead.123c4","name":"","active":true,"console":"false","complete":"true","x":315.51705169677734,"y":128.77272033691406,"wires":[]},{"id":"6ca4915a.e3548","type":"function","z":"ed632ead.123c4","name":"SOAP Formatter","func":"var newmsg={\n//  server:\"https://localhost:9080/teamworks/webservices/VT01/STTComplete.tws\",\n  options:{},\n  headers:{},\n  payload:{\n      webvtt: \"<![CDATA[\"+msg.payload+\"]]>\",\n      status: \"OK\",\n      correlationId: msg.correlationId\n  }\n};\n\nmsg.payload ='<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:stt=\"http://VT01/STTComplete.tws\"><soap:Header/><soap:Body><stt:STT_Results><stt:webvtt>'+\n'<![CDATA['+msg.payload+\n\"]]>\"+\n'</stt:webvtt>\\n'+\n'<stt:status>'+msg.statusCode+'</stt:status>\\n'+\n'<stt:correlationId>'+msg.correlationId+'</stt:correlationId>\\n'+\n'</stt:STT_Results>\\n'+\n'</soap:Body>\\n'+\n'</soap:Envelope>';\n\ndelete msg[\"statusCode\"];\ndelete msg[\"headers\"];\ndelete msg[\"req\"];\ndelete msg[\"res\"];\ndelete msg[\"url\"];\n\nreturn msg;","outputs":1,"noerr":0,"x":149,"y":563.0056028366089,"wires":[["9762e10b.8b489","7d726be8.a1f7e4"]]},{"id":"9762e10b.8b489","type":"http request","z":"ed632ead.123c4","name":"","method":"POST","ret":"txt","url":"https://localhost:9080/teamworks/webservices/VT01/STTComplete.tws","tls":"","x":375.5142288208008,"y":561.6107711791992,"wires":[["7d726be8.a1f7e4"]]},{"id":"19067728.8e4819","type":"inject","z":"ed632ead.123c4","name":"","topic":"","payload":"Demo Mode","payloadType":"str","repeat":"","crontab":"","once":false,"x":121.5169906616211,"y":20.88351058959961,"wires":[["9a16a1e3.0cbc2"]]},{"id":"9a16a1e3.0cbc2","type":"function","z":"ed632ead.123c4","name":"Demo Data","func":"msg.payload = {};\nmsg.payload.filename = \"/Users/DanT/Documents/Video_Transcription_with_Watson.mp4\";\nmsg.payload.respendpoint = \"\";\nmsg.payload.correlationId = \"demo\";\n\nreturn msg;","outputs":1,"noerr":0,"x":318.5113220214844,"y":20,"wires":[["3a5df2c2.ee7b0e"]]},{"id":"c94282de.30099","type":"file","z":"ed632ead.123c4","name":"Raw STT Out","filename":"/Users/DanT/Projects/raw.txt","appendNewline":true,"createDir":false,"overwriteFile":"true","x":667.7840576171875,"y":381.41190338134766,"wires":[]}]