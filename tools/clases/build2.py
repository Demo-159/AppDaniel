"""Audio y línea de tiempo para un short v2 (voz Brian, música con ritmo).
Uso: build2.py <guion.json> <carpeta_salida>"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EDGE = os.environ.get("EDGE_TTS", "edge-tts")
VOICE = "en-US-BrianMultilingualNeural"
script, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
S = json.load(open(script))
env = dict(os.environ)

def ff(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True, check=True).stdout)

VOICE_FX = ("highpass=f=90,equalizer=f=3200:t=q:w=1:g=3,equalizer=f=180:t=q:w=1:g=2,"
            "acompressor=threshold=-20dB:ratio=4:attack=5:release=60:makeup=3")
t = 0.0
for i, s in enumerate(S["scenes"]):
    raw, wav = os.path.join(out, f"raw{i}.mp3"), os.path.join(out, f"v{i}.wav")
    if not os.path.exists(wav):
        proxy = ["--proxy", os.environ["HTTPS_PROXY"]] if os.environ.get("HTTPS_PROXY") else []
        subprocess.run([EDGE, *proxy, "--voice", VOICE, "--rate=+15%", "--pitch=+3Hz",
                        "--text", s["say"], "--write-media", raw], check=True, env=env, capture_output=True)
        # quita silencios del inicio y final
        ff("-i", raw, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
           "silenceremove=start_periods=1:start_threshold=-45dB,areverse," + VOICE_FX, "-ar", "44100", wav)
    d = dur(wav)
    lead, tail = 0.25, (0.9 if s["anim"] in ("quiz", "outro") else 0.3)
    s.update(start=round(t, 3), speechStart=round(t + lead, 3), speechEnd=round(t + lead + d, 3), wav=wav)
    s["end"] = round(t + lead + d + tail, 3)
    if s["anim"] == "quiz":
        s["reveal"] = round(t + lead + d - s.get("revealBack", 0.75), 3)
    t = s["end"]
total = round(t, 3)

# Música: 112 BPM, bombo, hi-hat y bajo con progresión; se atenúa cuando habla la voz.
b = 60 / 112
roots = [110.0, 87.31, 130.81, 98.0]  # A F C G
bass = "+".join(f"between(mod(t,{8*b}),{2*b*k},{2*b*(k+1)})*sin(2*PI*{f}*t)" for k, f in enumerate(roots))
expr = (f"0.55*sin(2*PI*52*mod(t,{b}))*exp(-mod(t,{b})*16)"
        f"+0.12*(random(0)*2-1)*exp(-mod(t+{b/2},{b})*55)"
        f"+0.18*({bass})*exp(-mod(t,{b/2})*5)"
        f"+0.06*(random(1)*2-1)*exp(-mod(t+{b},{2*b})*28)*between(mod(t,{2*b}),{b},{2*b})")
music = os.path.join(out, "music.wav")
ff("-f", "lavfi", "-i", f"aevalsrc='{expr}':s=44100:d={total}", "-af",
   f"lowpass=f=6000,afade=t=in:d=0.6,afade=t=out:st={max(0, total-1.2)}:d=1.2,volume=0.55", "-ac", "2", music)
whoosh = os.path.join(out, "whoosh.wav")
ff("-f", "lavfi", "-i", "anoisesrc=d=0.4:c=pink:a=0.7", "-af",
   "highpass=f=700,lowpass=f=6000,afade=t=in:d=0.15,afade=t=out:st=0.15:d=0.25,volume=0.3", "-ar", "44100", "-ac", "2", whoosh)
boom = os.path.join(out, "boom.wav")
ff("-f", "lavfi", "-i", "aevalsrc='0.9*sin(2*PI*(70-40*t)*t)*exp(-t*5)':s=44100:d=0.8", "-ac", "2", boom)
ding = os.path.join(out, "ding.wav")
ff("-f", "lavfi", "-i", "aevalsrc='0.35*(sin(2*PI*1320*t)+0.6*sin(2*PI*1980*t))*exp(-t*6)':s=44100:d=0.7", "-ac", "2", ding)

# Pista de voz completa
inputs, filt, labs = [], [], []
def add(p, at, vol=1.0, lab=None):
    k = len(inputs) // 2
    inputs.extend(["-i", p]); ms = int(at * 1000)
    filt.append(f"[{k}]adelay={ms}|{ms},volume={vol}[x{k}]"); (lab if lab is not None else labs).append(f"[x{k}]")
voice_labs, fx_labs = [], []
for i, s in enumerate(S["scenes"]):
    add(s["wav"], s["speechStart"], 1.0, voice_labs)
    if i > 0: add(whoosh, max(0, s["start"] - 0.1), 1.0, fx_labs)
    if s["anim"] == "slam": add(boom, s["start"] + 0.35, 1.0, fx_labs)
    if s["anim"] == "quiz": add(ding, s["reveal"], 1.0, fx_labs)
    if s["anim"] == "people": add(ding, s["start"] + 1.6, 0.4, fx_labs)
add(music, 0, 1.0, labs)
mk = len(inputs) // 2 - 1
filt.append("".join(voice_labs) + f"amix=inputs={len(voice_labs)}:normalize=0,apad,atrim=0:{total},asplit=2[vo][sc]")
filt.append(f"[x{mk}][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md]")
filt.append("[vo][md]" + "".join(fx_labs) + f"amix=inputs={2+len(fx_labs)}:normalize=0,atrim=0:{total},loudnorm=I=-14:TP=-1[out]")
ff(*inputs, "-filter_complex", ";".join(filt), "-map", "[out]", "-ar", "44100", "-ac", "2", os.path.join(out, "audio.wav"))

for s in S["scenes"]:
    s.pop("wav", None)
S.update(total=total, fps=30)
json.dump(S, open(os.path.join(out, "timeline.json"), "w"), ensure_ascii=False)
print(f"{total:.1f}s", [round(s['end']-s['start'],1) for s in S['scenes']])
