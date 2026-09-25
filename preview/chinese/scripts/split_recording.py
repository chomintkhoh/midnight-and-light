#!/usr/bin/env python3
import csv,subprocess,sys,os,json
if len(sys.argv)<4: raise SystemExit("usage: split_recording.py recording.wav recording-script.csv output_dir")
src,csvp,out=sys.argv[1:4];os.makedirs(out,exist_ok=True)
detect=["ffmpeg","-i",src,"-af","silencedetect=noise=-38dB:d=1.0","-f","null","-"]
p=subprocess.run(detect,stderr=subprocess.PIPE,text=True)
ends=[]
for line in p.stderr.splitlines():
    if "silence_end:" in line:
        try: ends.append(float(line.split("silence_end:")[1].split("|")[0].strip()))
        except: pass
dur=float(json.loads(subprocess.check_output(["ffprobe","-v","quiet","-print_format","json","-show_format",src]))["format"]["duration"])
bounds=[0.0]+ends+[dur]
with open(csvp,encoding="utf-8-sig") as f: rows=list(csv.DictReader(f))
segments=[(bounds[i],bounds[i+1]) for i in range(len(bounds)-1) if bounds[i+1]-bounds[i]>.25]
if len(segments)!=len(rows):
    print(f"ERROR: detected {len(segments)} clips but CSV has {len(rows)} rows.")
    print("Check pauses around clip positions:", list(range(min(len(segments),len(rows))+1,max(len(segments),len(rows))+1)))
    raise SystemExit(2)
for row,(a,b) in zip(rows,segments):
    dest=os.path.join(out,row["档名"])
    subprocess.run(["ffmpeg","-y","-ss",str(a),"-to",str(b),"-i",src,"-af","silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB:stop_periods=1:stop_duration=0.15:stop_threshold=-45dB,loudnorm=I=-16:TP=-1.5:LRA=11","-ac","1","-b:a","64k",dest],check=True)
print("OK:",len(rows),"files")