import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ffmpeg = path.join(root, "tools", "audio-tools", "node_modules", "ffmpeg-static", "ffmpeg.exe");
const outDir = path.join(root, "assets", "dfsp", "sounds", "alarms");

fs.mkdirSync(outDir, { recursive: true });

const clips = [
  {
    input: "C:/Users/lylel/Downloads/beetpro-alarm-police-fire-ambulance-etc-sound-effect-26-11504.mp3",
    output: "beetpro.ogg",
    start: 0.0,
    duration: 1.35
  },
  {
    input: "C:/Users/lylel/Downloads/twisted-colossus-fire-alarm-414915.mp3",
    output: "twisted_fire.ogg",
    start: 0.0,
    duration: 1.65
  },
  {
    input: "C:/Users/lylel/Downloads/u_7j5wrh42a7-alarm-214447.mp3",
    output: "short_alarm.ogg",
    start: 0.0,
    duration: 1.55
  },
  {
    input: "C:/Users/lylel/Downloads/jeremayjimenez-bermuda-eas-alarm-2025-my-own-alarm-441470.mp3",
    output: "bermuda_eas.ogg",
    start: 0.0,
    duration: 1.8
  },
  {
    input: "C:/Users/lylel/Downloads/8footdino_on_scratch-alarm-301729.mp3",
    output: "eightfoot.ogg",
    start: 0.0,
    duration: 1.8
  },
  {
    input: "C:/Users/lylel/Downloads/jeremayjimenez-greece-eas-alarm-451404.mp3",
    output: "greece_eas.ogg",
    start: 0.0,
    duration: 1.9
  },
  {
    input: "C:/Users/lylel/Downloads/jeremayjimenez-taiwan-eas-alarm-501825.mp3",
    output: "taiwan_eas.ogg",
    start: 0.0,
    duration: 1.9
  },
  {
    input: "C:/Users/lylel/Downloads/ribhavagrawal-alarm-siren-sound-effect-type-01-294194.mp3",
    output: "siren_type01.ogg",
    start: 0.0,
    duration: 1.75
  },
  {
    input: "C:/Users/lylel/Downloads/freesound_community-alarm-26718.mp3",
    output: "city.ogg",
    start: 0.0,
    duration: 1.8
  },
  {
    input: "C:/Users/lylel/Downloads/dennish18-biohazard-alarm-143105.mp3",
    output: "biohazard.ogg",
    start: 0.0,
    duration: 2.1
  }
];

for (const clip of clips) {
  const outPath = path.join(outDir, clip.output);
  const fadeStart = Math.max(clip.duration - 0.08, 0.01).toFixed(2);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      String(clip.start),
      "-t",
      String(clip.duration),
      "-i",
      clip.input,
      "-vn",
      "-ac",
      "1",
      "-ar",
      "44100",
      "-af",
      `afade=t=in:st=0:d=0.01,afade=t=out:st=${fadeStart}:d=0.08`,
      "-c:a",
      "libvorbis",
      "-q:a",
      "2",
      outPath
    ],
    { stdio: "inherit" }
  );
}

console.log(`Wrote ${clips.length} alarm clips to ${outDir}`);
