import { useState, useEffect, useRef, useCallback } from "react";

const GRADES = [1,2,3,4,5];
const SUBJECTS = [
  { id:"math",      label:"Math",      icon:"🔢", color:"#FF6B6B",  desc:"Numbers, operations & problem solving" },
  { id:"science",   label:"Science",   icon:"🔬", color:"#4ECDC4",  desc:"Life, physical & earth science" },
  { id:"reading",   label:"Reading",   icon:"📚", color:"#C3A6FF",  desc:"Vocabulary, comprehension & grammar" },
  { id:"geography", label:"Geography", icon:"🌎", color:"#FFB347",  desc:"Maps, landforms & world regions" },
];

// ─── CURRICULUM DATA ──────────────────────────────────────────────────────────
function getMathUnits(grade) {
  const g = Number(grade);
  const all = [
    { id:"add_sub_20",    grade:1, label:"Add & Subtract to 20",      icon:"➕", color:"#FF6B6B", standard:"1.OA.1·1.OA.6",  description:"Add and subtract within 20.", levels:[{label:"Add within 10"},{label:"Subtract within 10"},{label:"Add within 20"},{label:"Subtract within 20"},{label:"Mixed within 20"}] },
    { id:"place_val_1",   grade:1, label:"Place Value to 120",         icon:"🔟", color:"#FFE66D", standard:"1.NBT.1·1.NBT.2", description:"Tens and ones. Count to 120.", levels:[{label:"Tens and ones"},{label:"Count to 50"},{label:"Count to 120"},{label:"Compare to 50"},{label:"Compare to 120"}] },
    { id:"add_sub_100",   grade:2, label:"Add & Subtract within 100",  icon:"➕", color:"#FF6B6B", standard:"2.OA.1·2.NBT.5", description:"Fluently add and subtract within 100.", levels:[{label:"Add within 50"},{label:"Subtract within 50"},{label:"Add within 100"},{label:"Subtract within 100"},{label:"Two-step problems"}] },
    { id:"place_val_2",   grade:2, label:"Place Value to 1000",        icon:"🔟", color:"#FFE66D", standard:"2.NBT.1·2.NBT.4", description:"Hundreds, tens, ones. Compare 3-digit numbers.", levels:[{label:"Hundreds"},{label:"Compare 3-digit"},{label:"Skip count 5/10/100"},{label:"Add 3-digit (no regroup)"},{label:"Add 3-digit (regroup)"}] },
    { id:"multiplication",grade:3, label:"Multiplication",             icon:"✖️", color:"#FF6B6B", standard:"3.OA.1·3.OA.7",  description:"Equal groups, multiply within 100.", levels:[{label:"Groups of 2s & 5s",factors:[2,5]},{label:"Groups of 3s & 4s",factors:[3,4]},{label:"Groups of 6s,7s & 8s",factors:[6,7,8]},{label:"Mixed Factors to 10"},{label:"Fluency within 100"}] },
    { id:"division",      grade:3, label:"Division",                   icon:"➗", color:"#4ECDC4", standard:"3.OA.2·3.OA.7",  description:"Equal sharing and grouping within 100.", levels:[{label:"Divide by 2 & 5",divisors:[2,5]},{label:"Divide by 3 & 4",divisors:[3,4]},{label:"Divide by 6,7 & 8",divisors:[6,7,8]},{label:"Mixed Divisors"},{label:"Fluency within 100"}] },
    { id:"mul_div_rel",   grade:3, label:"Fact Families",              icon:"🔗", color:"#FFE66D", standard:"3.OA.4·3.OA.6",  description:"Multiplication & division relationships.", levels:[{label:"Missing ×/÷ 2 & 5"},{label:"Missing ×/÷ 3 & 4"},{label:"Missing ×/÷ 6–8"},{label:"Unknown in Equations"},{label:"Fluency Mixed"}] },
    { id:"add_sub_1000",  grade:3, label:"Add & Subtract to 1000",     icon:"➕", color:"#A8E6CF", standard:"3.NBT.2",         description:"Fluently add and subtract within 1,000.", levels:[{label:"2-Digit Addition"},{label:"2-Digit Subtraction"},{label:"3-Digit (no regroup)"},{label:"3-Digit (with regroup)"},{label:"3-Digit Subtraction"}] },
    { id:"rounding",      grade:3, label:"Rounding",                   icon:"🔄", color:"#C3A6FF", standard:"3.NBT.1",         description:"Round to nearest 10 or 100.", levels:[{label:"Nearest 10 (to 100)"},{label:"Nearest 10 (to 1000)"},{label:"Nearest 100"},{label:"10 or 100 mixed"},{label:"Challenge"}] },
    { id:"fractions_3",   grade:3, label:"Fractions",                  icon:"½",  color:"#FFB347", standard:"3.NF.1·3.NF.3",  description:"Parts of a whole, compare fractions.", levels:[{label:"Unit Fractions",denoms:[2,3,4]},{label:"Non-Unit Fractions",denoms:[2,3,4,6,8]},{label:"Equivalent Fractions"},{label:"Compare Fractions"},{label:"Number Line"}] },
    { id:"word_prob_3",   grade:3, label:"Word Problems",              icon:"📖", color:"#FF9999", standard:"3.OA.8·3.NBT.2", description:"One- and two-step word problems.", levels:[{label:"Add & Subtract"},{label:"Multiplication"},{label:"Division"},{label:"Two-step"},{label:"Mixed"}] },
    { id:"mul_div_4",     grade:4, label:"Multi-digit ×/÷",           icon:"✖️", color:"#FF6B6B", standard:"4.NBT.5·4.NBT.6", description:"Multi-digit multiplication and division.", levels:[{label:"Multiply by 10/100"},{label:"2-digit × 1-digit"},{label:"3-digit × 1-digit"},{label:"2-digit × 2-digit"},{label:"Divide with remainders"}] },
    { id:"fractions_4",   grade:4, label:"Fractions",                  icon:"½",  color:"#C3A6FF", standard:"4.NF.1·4.NF.3",  description:"Equivalent fractions, add and subtract.", levels:[{label:"Equivalent fractions"},{label:"Compare fractions"},{label:"Add (same denom)"},{label:"Subtract fractions"},{label:"Mixed numbers"}] },
    { id:"decimals_4",    grade:4, label:"Decimals",                   icon:"🔢", color:"#FFE66D", standard:"4.NF.6·4.NF.7",  description:"Decimals to hundredths.", levels:[{label:"Tenths"},{label:"Hundredths"},{label:"Compare decimals"},{label:"Fractions↔decimals"},{label:"Word problems"}] },
    { id:"fractions_5",   grade:5, label:"Fractions ×/÷",             icon:"½",  color:"#C3A6FF", standard:"5.NF.3·5.NF.7",  description:"Multiply and divide fractions.", levels:[{label:"Fraction × whole"},{label:"Fraction × fraction"},{label:"Whole ÷ fraction"},{label:"Fraction ÷ whole"},{label:"Mixed numbers"}] },
    { id:"decimals_5",    grade:5, label:"Decimal Operations",         icon:"🔢", color:"#FFE66D", standard:"5.NBT.7",         description:"Add, subtract, multiply, divide decimals.", levels:[{label:"Add decimals"},{label:"Subtract decimals"},{label:"Multiply decimals"},{label:"Divide decimals"},{label:"Multi-step"}] },
  ];
  const grade_units = all.filter(u=>u.grade===g);
  const beyond = all.filter(u=>u.grade===g+1).map(u=>({...u,beyondGrade:true}));
  return [...grade_units,...beyond];
}

function getScienceUnits(grade) {
  const g = Number(grade);
  const all = [
    { id:"light_sound_1",  grade:1, label:"Light & Sound",         icon:"💡", color:"#FFE66D", standard:"1-PS4",     description:"How light travels and sound is made.",         levels:[{label:"What is sound?"},{label:"How does light travel?"},{label:"Reflecting light"},{label:"Communicating with light"},{label:"Challenge"}] },
    { id:"plants_anim_1",  grade:1, label:"Plants & Animals",      icon:"🌱", color:"#A8E6CF", standard:"1-LS1·1-LS3",description:"What plants and animals need to survive.",     levels:[{label:"What do plants need?"},{label:"What do animals need?"},{label:"Plant structures"},{label:"Animal structures"},{label:"Inherited traits"}] },
    { id:"matter_2",       grade:2, label:"Matter & Materials",    icon:"🧱", color:"#FF6B6B", standard:"2-PS1",     description:"Properties of materials and how they change.", levels:[{label:"Solid properties"},{label:"Liquid properties"},{label:"Heating & cooling"},{label:"Combining materials"},{label:"Challenge"}] },
    { id:"ecosystems_2",   grade:2, label:"Habitats & Ecosystems", icon:"🌿", color:"#4ECDC4", standard:"2-LS2·2-LS4",description:"Plants and animals depend on their habitat.",  levels:[{label:"What is a habitat?"},{label:"Plants in habitats"},{label:"Animals in habitats"},{label:"Biodiversity"},{label:"Challenge"}] },
    { id:"life_cycles",    grade:3, label:"Life Cycles",           icon:"🦋", color:"#A8E6CF", standard:"3-LS1",     description:"Birth, growth, reproduction, and death.",      levels:[{label:"Plant life cycles"},{label:"Insect life cycles"},{label:"Amphibian life cycles"},{label:"Mammal life cycles"},{label:"Comparing life cycles"}] },
    { id:"traits_inherit", grade:3, label:"Traits & Inheritance",  icon:"🧬", color:"#C3A6FF", standard:"3-LS3",     description:"Inherited vs. acquired traits.",               levels:[{label:"What is a trait?"},{label:"Inherited traits"},{label:"Acquired traits"},{label:"Parent vs. offspring"},{label:"Environment & traits"}] },
    { id:"ecosystems_3",   grade:3, label:"Ecosystems & Survival", icon:"🌿", color:"#4ECDC4", standard:"3-LS2·3-LS4",description:"Groups, fossils, adaptations, extinction.",   levels:[{label:"Animal groups"},{label:"Fossils & past environments"},{label:"Organisms & environments"},{label:"Adaptations"},{label:"Extinction & change"}] },
    { id:"forces_motion",  grade:3, label:"Forces & Motion",       icon:"⚡", color:"#FFE66D", standard:"3-PS2",     description:"Pushes, pulls, patterns, magnetic forces.",    levels:[{label:"Pushes and pulls"},{label:"Patterns in motion"},{label:"Balanced forces"},{label:"Magnetic forces"},{label:"Electric forces"}] },
    { id:"waves_4",        grade:4, label:"Waves & Energy",        icon:"〰️",color:"#FFE66D", standard:"4-PS4",     description:"Properties of waves and energy transfer.",     levels:[{label:"What is a wave?"},{label:"Wave properties"},{label:"Light waves"},{label:"Sound waves"},{label:"Information transfer"}] },
    { id:"rocks_4",        grade:4, label:"Rocks & Earth",         icon:"🪨", color:"#A8E6CF", standard:"4-ESS1·4-ESS2",description:"Earth's surface changes over time.",       levels:[{label:"Types of rocks"},{label:"Rock cycle"},{label:"Weathering & erosion"},{label:"Fossils in rock layers"},{label:"Earth's surface"}] },
    { id:"matter_5",       grade:5, label:"Matter & Interactions", icon:"⚗️", color:"#C3A6FF", standard:"5-PS1",     description:"Particles, states, physical vs chemical change.", levels:[{label:"Particles of matter"},{label:"States of matter"},{label:"Conservation of matter"},{label:"Physical changes"},{label:"Chemical changes"}] },
    { id:"ecosystems_5",   grade:5, label:"Ecosystems & Earth",    icon:"🌍", color:"#4ECDC4", standard:"5-LS2·5-ESS3",description:"Matter cycles, Earth systems, human impact.", levels:[{label:"Food webs"},{label:"Matter cycles"},{label:"Earth's systems"},{label:"Human impact"},{label:"Protecting ecosystems"}] },
  ];
  const grade_units = all.filter(u=>u.grade===g);
  const beyond = all.filter(u=>u.grade===g+1).map(u=>({...u,beyondGrade:true}));
  return [...grade_units,...beyond];
}

function getReadingUnits(grade) {
  const g = Number(grade);
  const all = [
    { id:"sight_1",       grade:1, label:"Sight Words",         icon:"👁️", color:"#C3A6FF", standard:"RF.1.3", description:"Know and read common high-frequency words.", levels:[{label:"Words 1–25"},{label:"Words 26–50"},{label:"Words 51–75"},{label:"Words 76–100"},{label:"Challenge words"}] },
    { id:"phonics_2",     grade:2, label:"Phonics & Decoding",  icon:"🔤", color:"#FF9999", standard:"RF.2.3", description:"Decode words using phonics patterns.", levels:[{label:"Short vowels"},{label:"Long vowels"},{label:"Blends & digraphs"},{label:"Vowel teams"},{label:"Multisyllabic words"}] },
    { id:"vocab_3",       grade:3, label:"Vocabulary",          icon:"📝", color:"#C3A6FF", standard:"L.3.4·L.3.5", description:"Word meaning, prefixes, suffixes, figurative language.", levels:[{label:"Context clues"},{label:"Prefixes (un-,re-,pre-)"},{label:"Suffixes (-ful,-less,-er)"},{label:"Synonyms & antonyms"},{label:"Figurative language"}] },
    { id:"comprehension", grade:3, label:"Comprehension",       icon:"🧠", color:"#FFB347", standard:"RI.3.1·RL.3.1", description:"Main idea, sequence, cause/effect.", levels:[{label:"Main idea & details"},{label:"Sequence of events"},{label:"Cause & effect"},{label:"Compare & contrast"},{label:"Author's purpose"}] },
    { id:"grammar_3",     grade:3, label:"Grammar",             icon:"✏️", color:"#A8E6CF", standard:"L.3.1·L.3.2", description:"Nouns, verbs, adjectives, punctuation.", levels:[{label:"Nouns & pronouns"},{label:"Verbs & tenses"},{label:"Adjectives & adverbs"},{label:"Punctuation"},{label:"Sentence structure"}] },
    { id:"vocab_4",       grade:4, label:"Advanced Vocabulary", icon:"📝", color:"#C3A6FF", standard:"L.4.4·L.4.6", description:"Greek/Latin roots, idioms, proverbs.", levels:[{label:"Greek roots"},{label:"Latin roots"},{label:"Idioms"},{label:"Proverbs"},{label:"Domain-specific words"}] },
    { id:"inform_text_4", grade:4, label:"Informational Text",  icon:"🧠", color:"#FFB347", standard:"RI.4.1·RI.4.8", description:"Text structure, point of view, arguments.", levels:[{label:"Text structure"},{label:"Point of view"},{label:"Summarizing"},{label:"Evaluating arguments"},{label:"Comparing texts"}] },
    { id:"word_study_5",  grade:5, label:"Word Study",          icon:"📝", color:"#C3A6FF", standard:"L.5.4·L.5.6", description:"Connotation, etymology, academic vocabulary.", levels:[{label:"Connotation"},{label:"Technical vocabulary"},{label:"Word relationships"},{label:"Figurative language"},{label:"Etymology"}] },
  ];
  const grade_units = all.filter(u=>u.grade===g);
  const beyond = all.filter(u=>u.grade===g+1).map(u=>({...u,beyondGrade:true}));
  return [...grade_units,...beyond];
}

function getGeographyUnits(grade) {
  const g = Number(grade);
  const all = [
    { id:"maps_1",       grade:1, label:"Maps & Directions",   icon:"🗺️", color:"#FFB347", standard:"NCSS-1", description:"Basic maps, compass directions.", levels:[{label:"N/S/E/W"},{label:"Reading simple maps"},{label:"Map symbols"},{label:"My neighborhood"},{label:"My community"}] },
    { id:"landforms_2",  grade:2, label:"Landforms & Water",   icon:"⛰️", color:"#4ECDC4", standard:"NCSS-2", description:"Major landforms and bodies of water.", levels:[{label:"Mountains & valleys"},{label:"Plains & plateaus"},{label:"Rivers & lakes"},{label:"Oceans & bays"},{label:"Challenge"}] },
    { id:"usa_3",        grade:3, label:"United States",       icon:"🇺🇸", color:"#FF6B6B", standard:"NCSS-3", description:"US regions, states, capitals, landmarks.", levels:[{label:"US regions"},{label:"Capitals: West"},{label:"Capitals: Central"},{label:"Capitals: East"},{label:"US Landmarks"}] },
    { id:"continents_3", grade:3, label:"Continents & Oceans", icon:"🌏", color:"#A8E6CF", standard:"NCSS-3", description:"7 continents and 5 oceans.", levels:[{label:"7 Continents"},{label:"5 Oceans"},{label:"Countries & continents"},{label:"World regions"},{label:"World challenge"}] },
    { id:"world_geo_4",  grade:4, label:"World Geography",     icon:"🌍", color:"#FFB347", standard:"NCSS-4", description:"Major countries, capitals, world features.", levels:[{label:"Americas"},{label:"Europe"},{label:"Asia"},{label:"Africa"},{label:"Capitals challenge"}] },
    { id:"climate_4",    grade:4, label:"Climate & Biomes",    icon:"🌦️", color:"#4ECDC4", standard:"NCSS-4", description:"How climate shapes life and ecosystems.", levels:[{label:"Climate zones"},{label:"Tropical biomes"},{label:"Desert biomes"},{label:"Forest biomes"},{label:"Polar biomes"}] },
    { id:"econ_5",       grade:5, label:"Geography & Economics",icon:"💰",color:"#C3A6FF", standard:"NCSS-5", description:"How geography influences trade and culture.", levels:[{label:"Natural resources"},{label:"Trade routes"},{label:"Cultural geography"},{label:"Human & physical"},{label:"Global connections"}] },
  ];
  const grade_units = all.filter(u=>u.grade===g);
  const beyond = all.filter(u=>u.grade===g+1).map(u=>({...u,beyondGrade:true}));
  return [...grade_units,...beyond];
}

function getUnits(subject, grade) {
  switch(subject) {
    case "math":      return getMathUnits(grade);
    case "science":   return getScienceUnits(grade);
    case "reading":   return getReadingUnits(grade);
    case "geography": return getGeographyUnits(grade);
    default:          return getMathUnits(grade);
  }
}

// ─── QUESTION GENERATORS ──────────────────────────────────────────────────────
function genMath(unit, levelIdx) {
  const level = unit.levels[levelIdx];
  switch(unit.id) {
    case "add_sub_20": { const max=20; const isAdd=levelIdx%2===0; const a=Math.floor(Math.random()*(max*0.7))+1,b=Math.floor(Math.random()*(max*0.3))+1; return isAdd?{text:`${a} + ${b} = ?`,answer:a+b,a,b,op:"add"}:{text:`${a+b} − ${b} = ?`,answer:a,a:a+b,b,op:"sub"}; }
    case "add_sub_100":{ const max=100;const isAdd=levelIdx<2||levelIdx===4&&Math.random()>.5;const a=Math.floor(Math.random()*60)+1,b=Math.floor(Math.random()*35)+1;return isAdd?{text:`${a} + ${b} = ?`,answer:a+b,a,b,op:"add"}:{text:`${a+b} − ${b} = ?`,answer:a,a:a+b,b,op:"sub"};}
    case "add_sub_1000":{const isAdd=levelIdx<2||levelIdx===4&&Math.random()>.5;const a=Math.floor(Math.random()*500)+50,b=Math.floor(Math.random()*300)+50;return isAdd?{text:`${a} + ${b} = ?`,answer:a+b,a,b,op:"add"}:{text:`${a+b} − ${b} = ?`,answer:a,a:a+b,b,op:"sub"};}
    case "place_val_1":case "place_val_2":{ const n=Math.floor(Math.random()*90)+10; return {text:`${Math.floor(n/10)} tens + ${n%10} ones = ?`,answer:n,a:Math.floor(n/10),b:n%10,op:"place"};}
    case "multiplication":{ const factors=level.factors||[1,2,3,4,5,6,7,8,9,10]; const a=factors[Math.floor(Math.random()*factors.length)],b=Math.floor(Math.random()*10)+1; return {text:`${a} × ${b} = ?`,answer:a*b,a,b,op:"mul"};}
    case "division":{ const divisors=level.divisors||[2,3,4,5,6,7,8,9]; const d=divisors[Math.floor(Math.random()*divisors.length)],q=Math.floor(Math.random()*10)+1; return {text:`${d*q} ÷ ${d} = ?`,answer:q,a:d*q,b:d,op:"div"};}
    case "mul_div_rel":{ const pool=[2,3,4,5,6,7,8,9];const d=pool[Math.floor(Math.random()*pool.length)],q=Math.floor(Math.random()*9)+2; return Math.random()>.5?{text:`${d} × ? = ${d*q}`,answer:q,a:d,b:d*q,op:"missing"}:{text:`${d*q} ÷ ${d} = ?`,answer:q,a:d*q,b:d,op:"div"};}
    case "rounding":{ const n=Math.floor(Math.random()*950)+50,to=levelIdx<=1?10:levelIdx===2?100:Math.random()>.5?100:10; return {text:`Round ${n} to the nearest ${to}.`,answer:Math.round(n/to)*to,n,to,op:"round"};}
    case "fractions_3":case "fractions_4":case "fractions_5":{ const denoms=level.denoms||[2,3,4,6,8];const d=denoms[Math.floor(Math.random()*denoms.length)],n=Math.floor(Math.random()*(d-1))+1; return {text:`Which shows ${n} out of ${d} equal parts?`,answer:`${n}/${d}`,choices:[`${n}/${d}`,`${Math.min(n+1,d-1)}/${d}`,`${n}/${d+1}`,`${Math.max(1,n-1)}/${d}`],op:"frac"};}
    case "mul_div_4":{ if(levelIdx===0){const a=Math.floor(Math.random()*9)+1,b=[10,100][Math.floor(Math.random()*2)];return {text:`${a} × ${b} = ?`,answer:a*b,a,b,op:"mul"};}const a=Math.floor(Math.random()*9)+1,b=Math.floor(Math.random()*99)+10;return {text:`${b} × ${a} = ?`,answer:b*a,a:b,b:a,op:"mul"};}
    case "decimals_4":case "decimals_5":{ const a=(Math.floor(Math.random()*90)+1)/10,b=(Math.floor(Math.random()*90)+1)/10;return {text:`${a.toFixed(1)} + ${b.toFixed(1)} = ?`,answer:parseFloat((a+b).toFixed(1)),a,b,op:"add"};}
    case "word_prob_3":{ const a=Math.floor(Math.random()*20)+3,b=Math.floor(Math.random()*12)+2;const pool=[{text:`Sam has ${a} 🍎 and gets ${b} more. Total?`,answer:a+b,op:"word_add"},{text:`${a} kids each get ${b} ⭐. Total stickers?`,answer:a*b,op:"word_mul"},{text:`${a*b} 🍇 split into ${a} bags equally. Each bag?`,answer:b,op:"word_div"},{text:`${a+b} birds 🐦. ${b} flew away. How many left?`,answer:a,op:"word_sub"}];return pool[Math.floor(Math.random()*pool.length)];}
    default:{ const a=Math.floor(Math.random()*50)+1,b=Math.floor(Math.random()*50)+1;return {text:`${a} + ${b} = ?`,answer:a+b,a,b,op:"add"};}
  }
}

const SCIENCE_QS = {
  life_cycles:[[{text:"What do most plants grow from?",answer:"Seeds",choices:["Seeds","Rocks","Water","Air"]},{text:"First stage of a butterfly's life?",answer:"Egg",choices:["Egg","Larva","Pupa","Adult"]},{text:"Plants need ___ to make food.",answer:"Sunlight",choices:["Sunlight","Darkness","Cold","Salt"]}],[{text:"What hatches from a butterfly egg?",answer:"Caterpillar (larva)",choices:["Caterpillar (larva)","Pupa","Adult","Nymph"]},{text:"Stage after larva in a butterfly?",answer:"Pupa (chrysalis)",choices:["Pupa (chrysalis)","Adult","Egg","Nymph"]},{text:"Which insect has complete metamorphosis?",answer:"Butterfly",choices:["Butterfly","Grasshopper","Cricket","Dragonfly nymph"]}],[{text:"A tadpole grows into a ___.",answer:"Frog",choices:["Frog","Fish","Lizard","Newt"]},{text:"Frogs are ___.",answer:"Amphibians",choices:["Amphibians","Reptiles","Mammals","Birds"]},{text:"Which hatches from eggs in water?",answer:"Frog",choices:["Frog","Dog","Horse","Rabbit"]}],[{text:"Mammals give birth to ___.",answer:"Live young",choices:["Live young","Eggs","Spores","Seeds"]},{text:"Which is a mammal?",answer:"Whale",choices:["Whale","Shark","Salmon","Crocodile"]},{text:"What do mammal mothers produce to feed babies?",answer:"Milk",choices:["Milk","Seeds","Honey","Leaves"]}],[{text:"4-stage life cycle: egg→larva→pupa→adult is called?",answer:"Complete metamorphosis",choices:["Complete metamorphosis","Incomplete metamorphosis","Direct development","Simple growth"]},{text:"Which does NOT lay eggs?",answer:"Dog",choices:["Dog","Frog","Butterfly","Chicken"]},{text:"Plants reproduce using ___.",answer:"Seeds or spores",choices:["Seeds or spores","Bones","Blood","Muscles"]}]],
  traits_inherit:[[{text:"A trait you are BORN with is called ___.",answer:"Inherited",choices:["Inherited","Acquired","Learned","Chosen"]},{text:"Which is an inherited trait?",answer:"Eye color",choices:["Eye color","A scar","Language","Hairstyle"]},{text:"Traits pass from ___ to offspring.",answer:"Parents",choices:["Parents","Teachers","Friends","Weather"]}],[{text:"An inherited trait in plants?",answer:"Leaf shape",choices:["Leaf shape","Broken branch","Drought damage","Pest holes"]},{text:"Kittens look like parents because of ___.",answer:"Inheritance",choices:["Inheritance","Environment","Diet","Exercise"]},{text:"DNA carries info about ___.",answer:"Inherited traits",choices:["Inherited traits","Learned skills","Daily habits","Weather"]}],[{text:"A scar is a(n) ___ trait.",answer:"Acquired",choices:["Acquired","Inherited","Genetic","Natural"]},{text:"Speaking a language is a ___ trait.",answer:"Acquired",choices:["Acquired","Inherited","Born-with","DNA"]},{text:"Which trait is ACQUIRED (not inherited)?",answer:"Playing piano",choices:["Playing piano","Blood type","Eye color","Height potential"]}],[{text:"Offspring usually look ___ their parents.",answer:"Similar to",choices:["Similar to","Exactly like","Nothing like","Opposite to"]},{text:"Which do parents pass to children?",answer:"Dimples",choices:["Dimples","A favorite food","A language","A scar"]},{text:"Why do siblings look different?",answer:"Variation in genes",choices:["Variation in genes","They eat differently","They choose traits","Random luck"]}],[{text:"Which changes CANNOT be passed to offspring?",answer:"Acquired traits",choices:["Acquired traits","Inherited traits","Genetic traits","DNA traits"]},{text:"Genetics is the study of ___.",answer:"Inherited traits",choices:["Inherited traits","Acquired skills","Weather","Fitness"]},{text:"If a parent is tall, offspring ___.",answer:"May also be tall",choices:["May also be tall","Are always tall","Are never tall","Are always short"]}]],
  ecosystems_3:[[{text:"Why do wolves hunt in packs?",answer:"To catch larger prey",choices:["To catch larger prey","They are tiny","They can't see","To stay warm"]},{text:"A pride is a group of ___.",answer:"Lions",choices:["Lions","Wolves","Fish","Penguins"]},{text:"Animals in groups are better at ___.",answer:"Surviving",choices:["Surviving","Flying","Changing color","Swimming faster"]}],[{text:"Fossils tell us about ___.",answer:"Past organisms",choices:["Past organisms","Future weather","Space travel","Ocean currents"]},{text:"A fossil forms when ___.",answer:"Organisms are preserved in rock",choices:["Organisms are preserved in rock","Animals dig holes","Plants grow tall","Rocks turn to soil"]},{text:"What can fossils tell us about ancient environments?",answer:"What it was like long ago",choices:["What it was like long ago","Tomorrow's weather","Ocean temperature now","Future plant growth"]}],[{text:"A habitat provides ___.",answer:"Food, water, shelter",choices:["Food, water, shelter","Only sunlight","Only water","Only food"]},{text:"A beaver builds ___ to change its environment.",answer:"A dam",choices:["A dam","A nest","A burrow","A web"]},{text:"When environment changes, animals must ___ or die.",answer:"Adapt or move",choices:["Adapt or move","Stay the same","Grow larger","Become rocks"]}],[{text:"An adaptation helps an animal ___.",answer:"Survive in its habitat",choices:["Survive in its habitat","Look colorful","Grow faster","Make noise"]},{text:"A polar bear's white fur is for ___.",answer:"Camouflage in snow",choices:["Camouflage in snow","Absorbing heat","Attracting mates","Finding fish"]},{text:"A desert animal adaptation?",answer:"Storing water in body",choices:["Storing water in body","Thick fur coat","Webbed feet","Gills"]}],[{text:"Extinction happens when ___.",answer:"All of a species die",choices:["All of a species die","Animals migrate","Seasons change","Floods occur"]},{text:"Dinosaurs went extinct because of ___.",answer:"A major environmental change",choices:["A major environmental change","They were hunted","They stopped eating","Only earthquakes"]},{text:"Biggest cause of species extinction today?",answer:"Habitat destruction",choices:["Habitat destruction","Recycling","Planting trees","Cleaning oceans"]}]],
  forces_motion:[[{text:"A push or pull is called a ___.",answer:"Force",choices:["Force","Mass","Speed","Wave"]},{text:"Kicking a ball is an example of a ___.",answer:"Push",choices:["Push","Pull","Gravity","Mass"]},{text:"Opening a drawer is a ___.",answer:"Pull",choices:["Pull","Push","Gravity","Friction"]}],[{text:"A pendulum swings in a ___ pattern.",answer:"Repeating",choices:["Repeating","Random","Spiral","One-time"]},{text:"A thrown ball follows a ___ path.",answer:"Curved arc",choices:["Curved arc","Straight up","Random","Circle"]},{text:"Which motion REPEATS?",answer:"Pendulum swinging",choices:["Pendulum swinging","Ball rolling off table","Door opening","Leaf falling"]}],[{text:"Balanced forces mean an object ___.",answer:"Does not move",choices:["Does not move","Speeds up","Slows down","Spins"]},{text:"Unbalanced force causes ___.",answer:"Change in motion",choices:["Change in motion","No movement","Object disappears","Object floats"]},{text:"Two equal forces from opposite sides are ___.",answer:"Balanced",choices:["Balanced","Unbalanced","Magnetic","Electric"]}],[{text:"Magnets attract objects made of ___.",answer:"Iron or steel",choices:["Iron or steel","Wood","Plastic","Glass"]},{text:"Which poles attract?",answer:"Opposite poles",choices:["Opposite poles","Same poles","Both north","Both south"]},{text:"Magnetic forces act ___.",answer:"Without touching",choices:["Without touching","Only when touching","Only in water","Only in space"]}],[{text:"Static electricity is caused by ___.",answer:"Buildup of electric charge",choices:["Buildup of electric charge","Magnetism","Gravity","Friction only"]},{text:"Electric forces can ___.",answer:"Attract or repel",choices:["Attract or repel","Only push","Only pull","Only spin"]},{text:"Best conductor of electricity?",answer:"Copper wire",choices:["Copper wire","Rubber","Wood","Plastic"]}]],
};

const READING_QS = {
  vocab_3:[[{text:"What does 'enormous' mean?",answer:"Very large",choices:["Very large","Very small","Very fast","Very quiet"]},{text:"What does 'ancient' mean?",answer:"Very old",choices:["Very old","Very new","Very big","Very cold"]},{text:"What does 'curious' mean?",answer:"Wanting to know more",choices:["Wanting to know more","Very tired","Very loud","Very sad"]}],[{text:"The prefix 'un-' means ___.",answer:"Not",choices:["Not","Again","Before","Too much"]},{text:"'Unhappy' means ___.",answer:"Not happy",choices:["Not happy","Very happy","Always happy","Happy before"]},{text:"The prefix 're-' means ___.",answer:"Again",choices:["Again","Not","Before","After"]}],[{text:"The suffix '-ful' means ___.",answer:"Full of",choices:["Full of","Without","Before","Not"]},{text:"'Colorless' means ___.",answer:"Without color",choices:["Without color","Full of color","Before color","Too much color"]},{text:"'-er' in 'teacher' means ___.",answer:"One who does",choices:["One who does","Full of","Without","Very"]}],[{text:"A synonym for 'happy' is ___.",answer:"Joyful",choices:["Joyful","Sad","Angry","Scared"]},{text:"An antonym for 'hot' is ___.",answer:"Cold",choices:["Cold","Warm","Burning","Steaming"]},{text:"A synonym for 'fast' is ___.",answer:"Quick",choices:["Quick","Slow","Large","Tall"]}],[{text:"'Raining cats and dogs' means ___.",answer:"Raining very hard",choices:["Raining very hard","Animals fell","Light drizzle","Cloudy sky"]},{text:"'Break a leg' means ___.",answer:"Good luck",choices:["Good luck","Get hurt","Break something","Run fast"]},{text:"A simile uses ___ or ___.",answer:"like or as",choices:["like or as","and or but","is or are","was or were"]}]],
  comprehension:[[{text:"The main idea is ___.",answer:"What the text is mostly about",choices:["What the text is mostly about","One small detail","The last sentence","Only the title"]},{text:"Supporting details ___.",answer:"Tell more about the main idea",choices:["Tell more about the main idea","Are always the title","Are unrelated","Come before main idea"]},{text:"Main idea is usually found ___.",answer:"In the first or last paragraph",choices:["In the first or last paragraph","Always in the middle","Only in pictures","In captions only"]}],[{text:"'First, then, next, finally' are ___ words.",answer:"Sequence",choices:["Sequence","Opinion","Cause","Effect"]},{text:"Sequence of events shows ___.",answer:"The order things happen",choices:["The order things happen","Why things happen","Where things happen","Who things happen to"]},{text:"Which event comes first in a story?",answer:"The beginning",choices:["The beginning","The climax","The end","The middle"]}],[{text:"'Because X, Y happened' shows ___.",answer:"Cause and effect",choices:["Cause and effect","Main idea","Sequence","Compare/contrast"]},{text:"The CAUSE is ___.",answer:"Why something happens",choices:["Why something happens","What happens","When it happens","Who it happens to"]},{text:"The EFFECT is ___.",answer:"What happens as a result",choices:["What happens as a result","Why it happens","Where it happens","Who caused it"]}],[{text:"'Both and neither' show ___.",answer:"Compare and contrast",choices:["Compare and contrast","Sequence","Main idea","Cause/effect"]},{text:"Compare finds ___.",answer:"How things are ALIKE",choices:["How things are ALIKE","How things differ","The main idea","The cause"]},{text:"Contrast finds ___.",answer:"How things are DIFFERENT",choices:["How things are DIFFERENT","How things are alike","The cause","The effect"]}],[{text:"Authors write to ___.",answer:"Inform, entertain, or persuade",choices:["Inform, entertain, or persuade","Only tell stories","Only give facts","Only write poems"]},{text:"Persuasive text tries to ___.",answer:"Change your opinion",choices:["Change your opinion","Tell a story","List facts","Entertain only"]},{text:"Informational text mainly ___.",answer:"Explains facts",choices:["Explains facts","Tells fiction","Rhymes","Uses only pictures"]}]],
  grammar_3:[[{text:"A noun is a ___.",answer:"Person, place, or thing",choices:["Person, place, or thing","Action word","Describing word","Connecting word"]},{text:"Which word is a noun?",answer:"River",choices:["River","Run","Fast","Quickly"]},{text:"A pronoun replaces a ___.",answer:"Noun",choices:["Noun","Verb","Adjective","Adverb"]}],[{text:"A verb shows ___.",answer:"An action or state of being",choices:["An action or state of being","A describing word","A person or place","A connecting word"]},{text:"Which is a verb?",answer:"Jump",choices:["Jump","Happy","Mountain","Quickly"]},{text:"Past tense of 'run' is ___.",answer:"Ran",choices:["Ran","Runned","Running","Runs"]}],[{text:"An adjective describes a ___.",answer:"Noun",choices:["Noun","Verb","Pronoun","Adverb"]},{text:"Which is an adjective?",answer:"Fluffy",choices:["Fluffy","Quickly","Runs","And"]},{text:"An adverb describes a ___.",answer:"Verb",choices:["Verb","Noun","Pronoun","Adjective"]}],[{text:"A question ends with ___.",answer:"A question mark",choices:["A question mark","A period","An exclamation point","A comma"]},{text:"'Wow, that was amazing!' ends with ___.",answer:"An exclamation point",choices:["An exclamation point","A period","A question mark","A comma"]},{text:"A sentence ends with ___.",answer:"A period, ?, or !",choices:["A period, ?, or !","A comma","A semicolon","Nothing"]}],[{text:"A complete sentence needs ___.",answer:"A subject and predicate",choices:["A subject and predicate","Only a noun","Only a verb","An adjective and noun"]},{text:"Which is a complete sentence?",answer:"The dog barked loudly.",choices:["The dog barked loudly.","Running fast.","Big red balloon.","Under the table."]},{text:"A compound sentence joins ideas with ___.",answer:"A conjunction (and, but, or)",choices:["A conjunction (and, but, or)","A period","A noun","An adjective"]}]],
};

const GEO_QS = {
  usa_3:[[{text:"How many US regions are there?",answer:"5",choices:["5","4","6","7"]},{text:"California is in the ___ region.",answer:"West",choices:["West","Midwest","South","Northeast"]},{text:"Texas is in the ___ region.",answer:"South",choices:["South","West","Northeast","Midwest"]}],[{text:"Capital of California?",answer:"Sacramento",choices:["Sacramento","Los Angeles","San Francisco","San Diego"]},{text:"Capital of Washington State?",answer:"Olympia",choices:["Olympia","Seattle","Spokane","Tacoma"]},{text:"Capital of Oregon?",answer:"Salem",choices:["Salem","Portland","Eugene","Bend"]}],[{text:"Capital of Texas?",answer:"Austin",choices:["Austin","Houston","Dallas","San Antonio"]},{text:"Capital of Colorado?",answer:"Denver",choices:["Denver","Boulder","Colorado Springs","Fort Collins"]},{text:"Capital of Arizona?",answer:"Phoenix",choices:["Phoenix","Tucson","Scottsdale","Flagstaff"]}],[{text:"Capital of New York?",answer:"Albany",choices:["Albany","New York City","Buffalo","Syracuse"]},{text:"Capital of Massachusetts?",answer:"Boston",choices:["Boston","Springfield","Cambridge","Worcester"]},{text:"Capital of Florida?",answer:"Tallahassee",choices:["Tallahassee","Miami","Orlando","Tampa"]}],[{text:"Which landmark is in Washington D.C.?",answer:"Lincoln Memorial",choices:["Lincoln Memorial","Statue of Liberty","Golden Gate Bridge","Space Needle"]},{text:"The Statue of Liberty is in ___.",answer:"New York",choices:["New York","Washington D.C.","California","Texas"]},{text:"The Grand Canyon is in ___.",answer:"Arizona",choices:["Arizona","Utah","Colorado","Nevada"]}]],
  continents_3:[[{text:"How many continents are there?",answer:"7",choices:["7","5","6","8"]},{text:"Largest continent?",answer:"Asia",choices:["Asia","Africa","North America","Europe"]},{text:"Smallest continent?",answer:"Australia",choices:["Australia","Europe","Antarctica","South America"]}],[{text:"How many oceans are there?",answer:"5",choices:["5","4","6","7"]},{text:"Largest ocean?",answer:"Pacific Ocean",choices:["Pacific Ocean","Atlantic Ocean","Indian Ocean","Arctic Ocean"]},{text:"Smallest ocean?",answer:"Arctic Ocean",choices:["Arctic Ocean","Indian Ocean","Atlantic Ocean","Southern Ocean"]}],[{text:"France is in ___.",answer:"Europe",choices:["Europe","Asia","Africa","North America"]},{text:"Brazil is in ___.",answer:"South America",choices:["South America","Africa","North America","Europe"]},{text:"China is in ___.",answer:"Asia",choices:["Asia","Europe","Africa","Australia"]}],[{text:"The equator divides Earth into ___.",answer:"N & S Hemispheres",choices:["N & S Hemispheres","E & W Hemispheres","Top & Bottom","Left & Right"]},{text:"Continent closest to South Pole?",answer:"Antarctica",choices:["Antarctica","South America","Australia","Africa"]},{text:"Australia is in the ___ hemisphere.",answer:"Southern",choices:["Southern","Northern","Eastern","Western"]}],[{text:"Continent with the most countries?",answer:"Africa",choices:["Africa","Asia","Europe","South America"]},{text:"No permanent human residents?",answer:"Antarctica",choices:["Antarctica","Greenland","Iceland","Australia"]},{text:"The Amazon River is in ___.",answer:"South America",choices:["South America","Africa","Asia","North America"]}]],
};

function genScience(unit, levelIdx) {
  const bank = SCIENCE_QS[unit.id];
  if(bank){const pool=bank[Math.min(levelIdx,bank.length-1)];return pool[Math.floor(Math.random()*pool.length)];}
  const fallback=[{text:"All living things need ___.",answer:"Water and energy",choices:["Water and energy","Only air","Only light","Only soil"]},{text:"The sun is a ___.",answer:"Star",choices:["Star","Planet","Moon","Comet"]},{text:"Plants make food using ___.",answer:"Photosynthesis",choices:["Photosynthesis","Digestion","Respiration","Germination"]}];
  return fallback[Math.floor(Math.random()*fallback.length)];
}

function genReading(unit, levelIdx) {
  const bank = READING_QS[unit.id];
  if(bank){const pool=bank[Math.min(levelIdx,bank.length-1)];return pool[Math.floor(Math.random()*pool.length)];}
  const fallback=[{text:"A noun is a ___.",answer:"Person, place, or thing",choices:["Person, place, or thing","Action word","Describing word","Joining word"]},{text:"The main idea is ___.",answer:"What the text is mostly about",choices:["What the text is mostly about","A small detail","The title only","The last word"]}];
  return fallback[Math.floor(Math.random()*fallback.length)];
}

function genGeo(unit, levelIdx) {
  const bank = GEO_QS[unit.id];
  if(bank){const pool=bank[Math.min(levelIdx,bank.length-1)];return pool[Math.floor(Math.random()*pool.length)];}
  const fallback=[{text:"Largest continent?",answer:"Asia",choices:["Asia","Africa","Europe","Australia"]},{text:"How many continents?",answer:"7",choices:["7","5","6","8"]}];
  return fallback[Math.floor(Math.random()*fallback.length)];
}

function generateQuestion(subject, unit, levelIdx) {
  let q;
  switch(subject){
    case "math":      q=genMath(unit,levelIdx); break;
    case "science":   q=genScience(unit,levelIdx); break;
    case "reading":   q=genReading(unit,levelIdx); break;
    case "geography": q=genGeo(unit,levelIdx); break;
    default:          q=genMath(unit,levelIdx);
  }
  if(!q.choices){
    const s=new Set([q.answer]);
    const d=[-3,-2,-1,1,2,3,4,-4];let i=0;
    while(s.size<4){const v=q.answer+d[i++%d.length];if(typeof q.answer==="number"&&v>=0)s.add(v);}
    if(s.size<4)while(s.size<4)s.add(q.answer+(s.size*7+3));
    q.choices=[...s].sort(()=>Math.random()-0.5);
  }
  return q;
}

function getSteps(q, subject) {
  if(subject!=="math") return [`Question: "${q.text}"`,`The correct answer is: "${q.answer}"`,`Think about what you know about this topic!`,`Review this and try again — you'll get it! ✅`];
  const {op,a,b,answer,n,to}=q;
  switch(op){
    case "mul": return [`We need ${a} × ${b}.`,`Think: ${a} groups with ${b} in each.`,`${Array.from({length:Math.min(a,6)},(_,i)=>`Group ${i+1}: ${b}`).join(" · ")}${a>6?" · ...":""}`,`✅ ${a} × ${b} = ${answer}`];
    case "div": return [`We need ${a} ÷ ${b}.`,`"How many groups of ${b} fit in ${a}?"`,`Count by ${b}s: ${Array.from({length:Math.min(answer,8)},(_,i)=>(i+1)*b).join(", ")}`,`✅ ${a} ÷ ${b} = ${answer}`];
    case "add": return [`Add ${a} + ${b}.`,`Start with ${Math.max(a,b)}, count up ${Math.min(a,b)}.`,`${a} + ${b} = ${answer}`,`✅ Answer: ${answer}`];
    case "sub": return [`Subtract: ${a} − ${b}.`,`Start at ${a}, count back ${b}.`,`Or think: ${b} + ? = ${a}`,`✅ Answer: ${answer}`];
    case "round": return [`Round ${n} to the nearest ${to}.`,`Multiples of ${to} near ${n}: ${Math.floor(n/to)*to} and ${Math.floor(n/to)*to+to}.`,`${n} is closer to ${answer}.`,`✅ ${n} → ${answer}`];
    case "missing": return [`${a} × ? = ${b}`,`Same as ${b} ÷ ${a}.`,`${b} ÷ ${a} = ${answer}`,`✅ Missing factor: ${answer}`];
    case "place": return [`${a} tens = ${a*10}. Plus ${b} ones = ${b}.`,`${a*10} + ${b} = ${answer}`,`✅ Answer: ${answer}`];
    default: return [`The correct answer is "${answer}".`,`Review this concept!`,`✅ You've got this!`];
  }
}

// ─── LEVEL SYSTEM ─────────────────────────────────────────────────────────────
// Each unit has 10 levels:
//   1-5  = LVUSD grade curriculum (start of year → end of year)
//   6-8  = Extended practice / harder problems (still grade level)
//   9-10 = Next grade early content (beyond LVUSD)
// difficulty() maps levelIdx (0-9) to a multiplier used in question generators

function difficulty(levelIdx) {
  // Returns {mult, label, tier}
  if(levelIdx<=4) return {mult:1+levelIdx*0.4, label:["Start of Year","Early Fall","Mid Year","Late Winter","End of Year"][levelIdx], tier:"grade"};
  if(levelIdx<=7) return {mult:3+((levelIdx-5)*0.8), label:["Challenge I","Challenge II","Challenge III","Advanced"][levelIdx-5], tier:"extended"};
  return {mult:5+(levelIdx-8)*1.5, label:["Next Grade Intro","Next Grade"][levelIdx-8], tier:"beyond"};
}

function buildLevels(baseLabels, nextGradeLabels) {
  // baseLabels: 5 LVUSD labels; nextGradeLabels: 2 beyond labels
  return [
    ...baseLabels.map((label,i)=>({label,tier:"grade",mult:1+i*0.4})),
    {label:"Challenge I",   tier:"extended", mult:3.0},
    {label:"Challenge II",  tier:"extended", mult:3.8},
    {label:"Challenge III", tier:"extended", mult:4.6},
    {label:"Advanced",      tier:"extended", mult:5.2},
    ...nextGradeLabels.map((label,i)=>({label,tier:"beyond",mult:6+i*1.5})),
  ];
}

// ─── COINS ────────────────────────────────────────────────────────────────────
// Coins earned per level completion:
//   Score ≥ 90% → 50 coins + 20 bonus
//   Score ≥ 75% → 35 coins
//   Score ≥ 60% → 20 coins
//   Below 60%   → 5 coins (participation)
// Extended levels (6-8) give 1.5× coins; Beyond (9-10) give 2× coins

function calcCoins(pct, tierOrLevelIdx) {
  const tier = typeof tierOrLevelIdx === "string" ? tierOrLevelIdx : difficulty(tierOrLevelIdx).tier;
  const mult = tier==="beyond"?2:tier==="extended"?1.5:1;
  let base = pct>=90?70:pct>=75?35:pct>=60?20:5;
  return Math.round(base*mult);
}

// ─── ELEVENLABS VOICE ─────────────────────────────────────────────────────────
// Voice: "Daniel" — warm, authoritative, clearly a teacher/adult male
// Voice ID: onwK4e9ZLuTAKqWW03F9 (Daniel — British educator, warm & clear)
// Alternative high-school-teacher voices:
//   "ErXwobaYiN019PkySvjV" = Antoni (warm American male, professional)
//   "VR6AewLTigWG4xSOukaG" = Arnold (confident American male)
//   "pNInz6obpgDQGcFmaJgB" = Adam   (deep, clear American male)
//   "onwK4e9ZLuTAKqWW03F9" = Daniel (warm British educator — RECOMMENDED)
const ELEVENLABS_API_KEY  = "";  // ← paste your key here
const ELEVENLABS_VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel — warm educator
const ELEVENLABS_MODEL    = "eleven_flash_v2_5";

let _activeAudio = null;

function stopSpeech() {
  if(_activeAudio){_activeAudio.pause();_activeAudio.src="";_activeAudio=null;}
  try{window.speechSynthesis?.cancel();}catch{}
}

function cleanForTTS(text){
  return text.replace(/[\u{1F000}-\u{1FFFF}]/gu,"").replace(/[\u{2600}-\u{27BF}]/gu,"")
    .replace(/[✅❌⭐🔊🔇■▶🎉💰🏆]/g,"").replace(/\s+/g," ").trim();
}

async function speakElevenLabs(text,onEnd){
  const clean=cleanForTTS(text);if(!clean){onEnd?.();return;}
  try{
    const res=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,{
      method:"POST",headers:{"xi-api-key":ELEVENLABS_API_KEY,"Content-Type":"application/json"},
      body:JSON.stringify({text:clean,model_id:ELEVENLABS_MODEL,voice_settings:{stability:0.55,similarity_boost:0.80,style:0.20,use_speaker_boost:true}})
    });
    if(!res.ok){speakBrowser(clean,onEnd);return;}
    const blob=await res.blob();const url=URL.createObjectURL(blob);
    const audio=new Audio(url);_activeAudio=audio;
    audio.onended=()=>{URL.revokeObjectURL(url);_activeAudio=null;onEnd?.();};
    audio.onerror=()=>{URL.revokeObjectURL(url);_activeAudio=null;onEnd?.();};
    audio.play();
  }catch(err){speakBrowser(cleanForTTS(text),onEnd);}
}

function speakBrowser(text,onEnd){
  if(!window.speechSynthesis){onEnd?.();return;}
  window.speechSynthesis.cancel();
  const utt=new SpeechSynthesisUtterance(text);
  utt.rate=0.90;utt.pitch=0.95;utt.volume=1;
  const vs=window.speechSynthesis.getVoices();
  const v=vs.find(v=>/daniel|alex|fred|bruce|ralph/i.test(v.name))
    ||vs.find(v=>v.lang==="en-GB"&&v.localService)
    ||vs.find(v=>v.lang==="en-US"&&v.localService)
    ||vs[0];
  if(v)utt.voice=v;
  utt.onend=()=>onEnd?.();
  window.speechSynthesis.speak(utt);
}

function speak(text,onEnd){
  const clean=cleanForTTS(text);if(!clean){onEnd?.();return;}
  ELEVENLABS_API_KEY?speakElevenLabs(clean,onEnd):speakBrowser(clean,onEnd);
}

// ─── IMPROVED TUTOR SYSTEM ────────────────────────────────────────────────────
async function askTutor(messages, q, unitLabel, subject, wrongAnswer, grade, levelIdx) {
  const diff = difficulty(levelIdx||0);
  const isWrongAnswer = wrongAnswer !== null && wrongAnswer !== undefined;

  const sys = `You are "Max", an experienced and warm high school teacher tutoring a Grade ${grade} student on ${subject} — specifically "${unitLabel}" (difficulty level: ${diff.label}).

THE PROBLEM: "${q.text}"
CORRECT ANSWER: "${q.answer}"
STUDENT'S ANSWER: "${isWrongAnswer ? wrongAnswer : "ran out of time"}"

YOUR JOB — diagnose WHY they got it wrong and explain it clearly:
1. First, acknowledge what they tried (don't shame them)
2. Identify the SPECIFIC misconception or error in their thinking
3. Explain the concept using a concrete real-world analogy relevant to a ${grade}th grader
4. Walk them through the correct reasoning step by step
5. End with a check: ask them to confirm they understand or try a simpler version mentally

RULES:
- Sound like a REAL TEACHER, not a cheerleader. Warm but substantive.
- 3-5 sentences max per response. Don't pad with filler.
- When they answer follow-up questions correctly, praise specifically what they did right.
- If they're still confused, try a DIFFERENT analogy or approach — don't repeat the same explanation.
- Use numbers and specifics, not vague encouragement.
- No excessive emojis — max 1 per message.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1000, system:sys, messages})
  });
  const d = await res.json();
  return d.content?.[0]?.text || "Let me think about how to explain this differently. What part is confusing you?";
}

// ─── IMPROVED STEP EXPLANATIONS ──────────────────────────────────────────────
function getSteps(q, subject, levelIdx) {
  if(subject!=="math") return [
    `The question was: "${q.text}"`,
    `The correct answer is: "${q.answer}"`,
    `Here's how to think about it: look for key words in the question that point to the answer.`,
    `Connect this to what you already know — what does this remind you of?`,
    `The answer is "${q.answer}" — remember this for next time. You've got this! ✅`,
  ];
  const {op,a,b,answer,n,to}=q;
  switch(op){
    case "mul": return [
      `Problem: ${a} × ${b} — this means "${a} equal groups, each with ${b} items."`,
      `Picture it: ${Math.min(a,5)} rows of ${b} objects${a>5?" (and more rows)":""}. Count them all up.`,
      `Add ${b} a total of ${a} times: ${Array.from({length:Math.min(a,6)},()=>b).join(" + ")}${a>6?" + ...":""}.`,
      `${a} × ${b} = ${answer}. The shortcut: memorize your times tables — it'll save you tons of time. ✅`,
    ];
    case "div": return [
      `Problem: ${a} ÷ ${b} — this asks "how many groups of ${b} fit inside ${a}?"`,
      `Think of it as sharing: if ${a} items are split into groups of ${b}, how many groups do you get?`,
      `Count up by ${b}s: ${Array.from({length:Math.min(answer,8)},(_,i)=>(i+1)*b).join(", ")}${answer>8?" ...":""} — that's ${answer} groups.`,
      `Check your work: ${answer} × ${b} = ${a}. Division and multiplication are opposites! ✅`,
    ];
    case "add": return [
      `Problem: ${a} + ${b}. Start with the larger number to make it easier.`,
      `Put ${Math.max(a,b)} in your head. Now count up ${Math.min(a,b)} more: ${Math.max(a,b)} → ${answer}.`,
      `Or use place value: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${Math.floor(a/10)*10+Math.floor(b/10)*10}, then add the ones: ${a%10} + ${b%10} = ${(a%10)+(b%10)}.`,
      `${a} + ${b} = ${answer}. Always check by doing it the opposite way: ${answer} − ${b} = ${a}. ✅`,
    ];
    case "sub": return [
      `Problem: ${a} − ${b}. Think of it as: "what do I add to ${b} to get ${a}?"`,
      `Count up from ${b} to ${a}: ${b} + ? = ${a}. The gap is ${answer}.`,
      `Or count back: start at ${a}, take away ${b}, land on ${answer}.`,
      `Check: ${answer} + ${b} = ${a}. Subtraction and addition always undo each other. ✅`,
    ];
    case "round": return [
      `Round ${n} to the nearest ${to}. Find the two multiples of ${to} on either side.`,
      `${Math.floor(n/to)*to} ← ${n} → ${Math.floor(n/to)*to+to}. The midpoint is ${Math.floor(n/to)*to+to/2}.`,
      `${n} is ${n>=(Math.floor(n/to)*to+to/2)?"at or above":"below"} the midpoint, so round ${n>=(Math.floor(n/to)*to+to/2)?"UP":"DOWN"}.`,
      `Answer: ${answer}. Rule: if the digit is 5 or more, round up. Less than 5, round down. ✅`,
    ];
    case "missing": return [
      `Problem: ${a} × ? = ${b}. We need the missing factor.`,
      `Flip it into a division problem: ${b} ÷ ${a} = ?`,
      `${b} ÷ ${a} = ${answer}. Check: ${a} × ${answer} = ${b}. Correct! ✅`,
      `Key insight: multiplication and division are two sides of the same fact family. ✅`,
    ];
    case "place": return [
      `${a} tens means ${a} × 10 = ${a*10}. Plus ${b} ones = ${b}.`,
      `${a*10} + ${b} = ${answer}. Think of it like money: ${a} dimes (${a*10}¢) + ${b} pennies = ${answer}¢.`,
      `Answer: ${answer}. ✅`,
    ];
    default: return [
      `The correct answer is "${answer}".`,
      `Re-read the question carefully and identify what operation to use.`,
      `Check your work by working backwards from the answer. ✅`,
    ];
  }
}

// ─── COIN RESULT MODAL ────────────────────────────────────────────────────────
function CoinModal({coins, pct, levelLabel, tier, onClose}) {
  const msg = pct>=90?"Outstanding work!":pct>=75?"Solid effort!":pct>=60?"Good start!":"Keep practicing!";
  const tierColor = tier==="beyond"?"#C3A6FF":tier==="extended"?"#FFE66D":"#4ECDC4";
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(160deg,#1a1a2e,#16213e)",border:`2px solid ${tierColor}44`,borderRadius:24,padding:"32px 28px",maxWidth:340,width:"100%",textAlign:"center",animation:"pop 0.4s ease-out"}}>
        <div style={{fontSize:52,marginBottom:8}}>🪙</div>
        <div style={{color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:42,marginBottom:4}}>+{coins}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:16}}>coins earned</div>
        <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:20,marginBottom:6}}>{msg}</div>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginBottom:6}}>{levelLabel}</div>
        <div style={{background:`${tierColor}22`,border:`1px solid ${tierColor}44`,borderRadius:20,padding:"4px 14px",display:"inline-block",marginBottom:20}}>
          <span style={{color:tierColor,fontSize:12,fontWeight:700}}>{tier==="beyond"?"🚀 Beyond Grade ×2":tier==="extended"?"⚡ Challenge ×1.5":"📚 Curriculum ×1"}</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"12px",marginBottom:18}}>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginBottom:4}}>Score breakdown</div>
          <div style={{display:"flex",justifyContent:"space-between",color:"white",fontSize:13}}>
            <span>Accuracy</span><span style={{color:pct>=75?"#4ECDC4":"#FFE66D"}}>{pct}%</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",color:"white",fontSize:13,marginTop:4}}>
            <span>Coins earned</span><span style={{color:"#FFE66D"}}>🪙 {coins}</span>
          </div>
        </div>
        <button onClick={onClose} style={{background:"#FFE66D",border:"none",borderRadius:13,padding:"13px 32px",color:"#1a1a2e",fontFamily:"'Fredoka One'",fontSize:17,cursor:"pointer",width:"100%"}}>
          Awesome! Continue →
        </button>
      </div>
    </div>
  );
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Stars({count}){return <div style={{display:"flex",gap:3}}>{[1,2,3].map(i=><span key={i} style={{fontSize:15,filter:i<=count?"none":"grayscale(1) opacity(0.2)"}}>⭐</span>)}</div>;}
function Bar({value,color}){return <div style={{background:"rgba(255,255,255,0.1)",borderRadius:99,height:5,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:color,width:`${Math.min(100,value)}%`,transition:"width 0.5s"}}/></div>;}

const CSS=`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes pop{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes slideUp{0%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes coinPop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
.card-hover{transition:transform 0.2s;cursor:pointer;}.card-hover:hover{transform:translateY(-4px) scale(1.02);}
.btn-hover{transition:transform 0.15s;cursor:pointer;}.btn-hover:hover{transform:scale(1.04);}
.choice-btn{transition:all 0.15s;cursor:pointer;}.choice-btn:hover{transform:scale(1.03);}
.tab-btn{transition:all 0.2s;cursor:pointer;}textarea:focus{outline:none;}input:focus{outline:none;}`;

// ─── TUTOR PANEL ─────────────────────────────────────────────────────────────
function TutorPanel({question,unitLabel,subject,grade,wrongAnswer,color,levelIdx,onContinue}){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(true);
  const [showChat,setShowChat]=useState(false);
  const [isSpeaking,setIsSpeaking]=useState(false);
  const [voiceOn,setVoiceOn]=useState(true);
  const [activeStep,setActiveStep]=useState(null);
  const chatEndRef=useRef(null);
  const voiceRef=useRef(true);
  const steps=getSteps(question,subject,levelIdx);

  useEffect(()=>{voiceRef.current=voiceOn;},[voiceOn]);
  const sayIt=useCallback((text)=>{if(!voiceRef.current)return;setIsSpeaking(true);speak(text,()=>setIsSpeaking(false));},[]);
  useEffect(()=>()=>stopSpeech(),[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  useEffect(()=>{(async()=>{
    const intro=[{role:"user",content:`I answered "${wrongAnswer??"nothing — time ran out"}" but the correct answer is "${question.answer}". Can you explain what I did wrong and how to think about it correctly?`}];
    const reply=await askTutor(intro,question,unitLabel,subject,wrongAnswer,grade,levelIdx);
    setMessages([intro[0],{role:"assistant",content:reply}]);
    setLoading(false);
    setTimeout(()=>sayIt(reply),400);
  })();},[]);

  const handleStepTap=(step,i)=>{setActiveStep(i);stopSpeech();sayIt(step);};

  const send=async()=>{
    if(!input.trim()||loading)return;
    stopSpeech();
    const u={role:"user",content:input.trim()};const upd=[...messages,u];
    setMessages(upd);setInput("");setLoading(true);
    const r=await askTutor(upd,question,unitLabel,subject,wrongAnswer,grade,levelIdx);
    setMessages(m=>[...m,{role:"assistant",content:r}]);
    setLoading(false);setTimeout(()=>sayIt(r),200);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:100,background:"linear-gradient(160deg,#0d1117,#161b22)",display:"flex",flexDirection:"column",fontFamily:"'Nunito',sans-serif"}}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{background:"rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"11px 13px",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${color},${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,animation:isSpeaking?"bounce 0.4s ease-in-out infinite":"bounce 2s ease-in-out infinite",boxShadow:isSpeaking?`0 0 18px ${color}99`:"none",transition:"box-shadow 0.3s"}}>🦉</div>
        <div>
          <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:15}}>Max — Your Tutor</div>
          <div style={{display:"flex",alignItems:"center",gap:5,color:isSpeaking?"#FFE66D":"#4ECDC4",fontSize:11,fontWeight:700,transition:"color 0.3s"}}>
            {isSpeaking&&[0,1,2].map(i=><span key={i} style={{display:"inline-block",width:4,height:4,borderRadius:"50%",background:"#FFE66D",animation:`bounce 0.8s ease-in-out infinite ${i*0.15}s`}}/>)}
            <span>{isSpeaking?"Speaking…":"Ready to help!"}</span>
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>{setVoiceOn(v=>{if(v)stopSpeech();return !v;})}} style={{background:voiceOn?`${color}22`:"rgba(255,255,255,0.05)",border:`1.5px solid ${voiceOn?color+"44":"rgba(255,255,255,0.1)"}`,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",flexShrink:0}}>
            {voiceOn?"🔊":"🔇"}
          </button>
          {isSpeaking&&<button onClick={stopSpeech} style={{background:"rgba(255,107,107,0.15)",border:"1.5px solid rgba(255,107,107,0.3)",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",color:"#FF6B6B",fontWeight:900,flexShrink:0}}>■</button>}
          <button onClick={()=>{stopSpeech();onContinue();}} style={{background:`${color}22`,border:`1.5px solid ${color}55`,color,borderRadius:10,padding:"6px 11px",fontFamily:"'Fredoka One'",fontSize:13,cursor:"pointer",flexShrink:0}}>Next →</button>
        </div>
      </div>

      {/* Wrong answer banner */}
      <div style={{margin:"9px 13px 0",background:"rgba(255,107,107,0.08)",border:"1.5px solid rgba(255,107,107,0.2)",borderRadius:13,padding:"9px 13px",animation:"pop 0.3s ease-out"}}>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:4}}>{unitLabel.toUpperCase()} · {difficulty(levelIdx||0).label.toUpperCase()}</div>
        <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:question.text?.length>60?15:18,lineHeight:1.4}}>{question.text}</div>
        <div style={{display:"flex",gap:7,marginTop:7,flexWrap:"wrap"}}>
          <span style={{background:"rgba(255,107,107,0.2)",border:"1px solid #FF6B6B44",borderRadius:7,padding:"3px 9px",color:"#FF6B6B",fontSize:12,fontWeight:700}}>✗ You said: {wrongAnswer??"timed out"}</span>
          <span style={{background:"rgba(78,205,196,0.2)",border:"1px solid #4ECDC444",borderRadius:7,padding:"3px 9px",color:"#4ECDC4",fontSize:12,fontWeight:700}}>✓ Correct: {question.answer}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,padding:"9px 13px 0"}}>
        {["📋 Steps","💬 Ask Max"].map((tab,i)=><button key={i} className="tab-btn" onClick={()=>{stopSpeech();setShowChat(i===1);}} style={{flex:1,padding:"9px",borderRadius:10,fontFamily:"'Fredoka One'",fontSize:13,border:"none",background:showChat===(i===1)?color:"rgba(255,255,255,0.06)",color:showChat===(i===1)?"#1a1a2e":"rgba(255,255,255,0.5)"}}>{tab}</button>)}
      </div>

      {/* Steps tab */}
      {!showChat&&<div style={{flex:1,overflow:"auto",padding:"11px 13px"}}>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:8}}>TAP A STEP TO HEAR IT</div>
        {steps.map((step,i)=>(
          <div key={i} onClick={()=>handleStepTap(step,i)} style={{display:"flex",gap:9,marginBottom:8,animation:`slideUp 0.3s ease-out ${i*0.07}s both`,cursor:"pointer",opacity:activeStep!==null&&activeStep!==i?0.55:1,transition:"opacity 0.2s"}}>
            <div style={{width:26,height:26,borderRadius:7,flexShrink:0,background:activeStep===i?color:i===steps.length-1?"#4ECDC4":`${color}25`,border:`1.5px solid ${activeStep===i?color:i===steps.length-1?"#4ECDC4":color+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",color:activeStep===i||i===steps.length-1?"#1a1a2e":color,fontSize:11,fontFamily:"'Fredoka One'",transition:"all 0.2s",boxShadow:activeStep===i?`0 0 10px ${color}88`:"none"}}>
              {activeStep===i?"▶":i+1}
            </div>
            <div style={{flex:1,background:activeStep===i?`${color}18`:"rgba(255,255,255,0.05)",borderRadius:9,padding:"7px 11px",color:"white",fontSize:13,lineHeight:1.6,fontWeight:i===steps.length-1?700:400,border:activeStep===i?`1.5px solid ${color}55`:i===steps.length-1?"1.5px solid #4ECDC433":"1.5px solid rgba(255,255,255,0.06)",transition:"all 0.2s"}}>{step}</div>
          </div>
        ))}
        <button className="tab-btn" onClick={()=>{stopSpeech();setShowChat(true);}} style={{width:"100%",marginTop:7,background:`${color}15`,border:`1.5px solid ${color}44`,borderRadius:11,padding:11,color,fontFamily:"'Fredoka One'",fontSize:14,cursor:"pointer"}}>Still confused? Ask Max! 💬</button>
      </div>}

      {/* Chat tab */}
      {showChat&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,overflow:"auto",padding:"11px 13px",display:"flex",flexDirection:"column",gap:9}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"slideUp 0.25s ease-out"}}>
              {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:8,background:`${color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginRight:6,flexShrink:0}}>🦉</div>}
              <div style={{maxWidth:"78%",padding:"8px 12px",borderRadius:m.role==="user"?"13px 13px 4px 13px":"13px 13px 13px 4px",background:m.role==="user"?color:"rgba(255,255,255,0.08)",color:m.role==="user"?"#1a1a2e":"white",fontSize:13,lineHeight:1.6,fontWeight:m.role==="user"?700:400}}>
                {m.content}
                {m.role==="assistant"&&<button onClick={()=>sayIt(m.content)} style={{display:"inline-block",marginLeft:6,background:"none",border:"none",cursor:"pointer",fontSize:12,opacity:0.5,verticalAlign:"middle"}}>🔊</button>}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:26,height:26,borderRadius:8,background:`${color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🦉</div>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"13px 13px 13px 4px",padding:"9px 13px",display:"flex",gap:4}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:color,animation:`bounce 1s ease-in-out infinite ${i*0.18}s`}}/>)}
            </div>
          </div>}
          <div ref={chatEndRef}/>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",padding:"9px 13px",display:"flex",gap:7,alignItems:"flex-end",background:"rgba(0,0,0,0.2)"}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask Max to explain differently, give an example, or check your thinking..." rows={1} style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"9px 11px",color:"white",fontSize:13,fontFamily:"'Nunito'",resize:"none",maxHeight:90}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{background:input.trim()&&!loading?color:"rgba(255,255,255,0.07)",border:"none",borderRadius:9,width:36,height:36,fontSize:14,cursor:input.trim()&&!loading?"pointer":"default",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",color:input.trim()&&!loading?"#1a1a2e":"rgba(255,255,255,0.25)",flexShrink:0}}>➤</button>
        </div>
      </div>}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
const TOTAL_Q=10, Q_TIME=30, STAR_T=[60,75,90];

// 10 levels per unit — built dynamically in the levels screen
// Level tiers: 1-5 = grade curriculum, 6-8 = extended challenge, 9-10 = beyond grade

export default function Clariva() {
  const [screen,setScreen]=useState("onboard");
  const [grade,setGrade]=useState(null);
  const [studentName,setStudentName]=useState("");
  const [nameInput,setNameInput]=useState("");
  const [activeSubject,setActiveSubject]=useState(null);
  const [activeUnit,setActiveUnit]=useState(null);
  const [activeLevel,setActiveLevel]=useState(0);
  const [questions,setQuestions]=useState([]);
  const [qIndex,setQIndex]=useState(0);
  const [score,setScore]=useState(0);
  const [selected,setSelected]=useState(null);
  const [feedback,setFeedback]=useState(null);
  const [timeLeft,setTimeLeft]=useState(Q_TIME);
  const [showTutor,setShowTutor]=useState(false);
  const [wrongAnswer,setWrongAnswer]=useState(null);
  const [streakCount,setStreakCount]=useState(0);
  const [showCoinModal,setShowCoinModal]=useState(false);
  const [lastCoins,setLastCoins]=useState(0);
  const [lastPct,setLastPct]=useState(0);

  const [progress,setProgress]=useState(()=>{try{const s=localStorage.getItem("clariva_v4");return s?JSON.parse(s):{}}catch{return {};}});
  const [coins,setCoins]=useState(()=>{try{return Number(localStorage.getItem("clariva_coins")||0)}catch{return 0;}});

  useEffect(()=>{try{localStorage.setItem("clariva_v4",JSON.stringify(progress));}catch{}},[progress]);
  useEffect(()=>{try{localStorage.setItem("clariva_coins",String(coins));}catch{}},[coins]);

  const totalStars=Object.values(progress).flatMap(s=>Object.values(s).flatMap(u=>Object.values(u))).reduce((a,b)=>a+b,0);

  const saveProg=useCallback((sid,uid,lvl,pct)=>{
    const stars=pct>=STAR_T[2]?3:pct>=STAR_T[1]?2:pct>=STAR_T[0]?1:0;
    const earned=calcCoins(pct, lvl);
    setProgress(prev=>{const s=prev[sid]||{};const u=s[uid]||{};return {...prev,[sid]:{...s,[uid]:{...u,[lvl]:Math.max(u[lvl]||0,stars)}}};});
    setCoins(c=>c+earned);
    return {stars, earned};
  },[]);

  // Generate 10 levels for any unit using difficulty multiplier
  function getLevelsFor(unit) {
    const base = unit.levels || [];
    // Take the 5 LVUSD labels, then add 5 more
    const gradeLabels = base.slice(0,5).map(l=>l.label);
    while(gradeLabels.length<5) gradeLabels.push(`Level ${gradeLabels.length+1}`);
    const nextGradeLabel = unit.beyondGrade ? "Advanced I" : `Grade ${Number(grade)+1} Intro`;
    return buildLevels(gradeLabels, [nextGradeLabel,"Advanced II"]);
  }

  const startQuiz=(unit,levelIdx)=>{
    const qs=Array.from({length:TOTAL_Q},()=>{
      const q=generateQuestion(activeSubject.id,unit,levelIdx);
      return q;
    });
    setQuestions(qs);setQIndex(0);setScore(0);setSelected(null);setFeedback(null);
    setTimeLeft(Q_TIME);setActiveUnit(unit);setActiveLevel(levelIdx);
    setStreakCount(0);setShowTutor(false);setScreen("quiz");
  };

  useEffect(()=>{
    if(screen!=="quiz"||feedback!==null||showTutor)return;
    if(timeLeft<=0){handleAnswer(null);return;}
    const t=setTimeout(()=>setTimeLeft(v=>v-1),1000);return()=>clearTimeout(t);
  },[timeLeft,screen,feedback,showTutor]);

  const handleAnswer=(choice)=>{
    if(feedback!==null)return;
    const q=questions[qIndex];
    const correct=String(q?.answer)===String(choice);
    setSelected(choice);setFeedback(correct?"correct":"wrong");
    if(correct){setScore(s=>s+1);setStreakCount(s=>s+1);setTimeout(()=>advance(true),900);}
    else{setWrongAnswer(choice);setStreakCount(0);setTimeout(()=>setShowTutor(true),700);}
  };

  const advance=(ok=true)=>{
    setShowTutor(false);
    const next=qIndex+1;
    if(next>=TOTAL_Q){
      const f=ok?score+1:score;
      const pct=Math.round((f/TOTAL_Q)*100);
      const {earned}=saveProg(activeSubject.id,activeUnit.id,activeLevel,pct);
      setScore(f);setLastPct(pct);setLastCoins(earned);
      setShowCoinModal(true);
      setScreen("result");
    } else {setQIndex(next);setSelected(null);setFeedback(null);setTimeLeft(Q_TIME);}
  };

  const getStarsFor=(sid,uid,lvl)=>progress[sid]?.[uid]?.[lvl]||0;
  const getUnitPct=(sid,uid)=>{
    const all=progress[sid]?.[uid]||{};
    const earned=Object.values(all).reduce((a,b)=>a+b,0);
    const max=10*3;
    return Math.round((earned/max)*100);
  };

  // ── ONBOARD ──
  if(screen==="onboard") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:22}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:380,animation:"pop 0.4s ease-out"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:52,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>✨</div>
          <div style={{color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:36,marginTop:6}}>Clariva</div>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginTop:3}}>Your AI-powered learning adventure</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:22,padding:"22px 18px"}}>
          <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:17,marginBottom:12,textAlign:"center"}}>👋 What's your name?</div>
          <input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="Enter your name..."
            style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:11,padding:"11px 14px",color:"white",fontSize:15,fontFamily:"'Nunito'",marginBottom:18}}/>
          <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:17,marginBottom:11,textAlign:"center"}}>📚 What grade are you in?</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7,marginBottom:20}}>
            {GRADES.map(g=><button key={g} onClick={()=>setGrade(g)} className="btn-hover"
              style={{background:grade===g?"#FFE66D":"rgba(255,255,255,0.07)",border:`2px solid ${grade===g?"#FFE66D":"rgba(255,255,255,0.13)"}`,borderRadius:11,padding:"11px 4px",color:grade===g?"#1a1a2e":"white",fontFamily:"'Fredoka One'",fontSize:17,cursor:"pointer"}}>
              {g}<div style={{fontSize:9,marginTop:1,opacity:0.7}}>Grade</div></button>)}
          </div>
          <button onClick={()=>{if(grade&&nameInput.trim()){setStudentName(nameInput.trim());setScreen("subjects");}}}
            disabled={!grade||!nameInput.trim()} className="btn-hover"
            style={{width:"100%",background:grade&&nameInput.trim()?"#FFE66D":"rgba(255,255,255,0.1)",border:"none",borderRadius:13,padding:"13px",color:grade&&nameInput.trim()?"#1a1a2e":"rgba(255,255,255,0.25)",fontFamily:"'Fredoka One'",fontSize:17,cursor:grade&&nameInput.trim()?"pointer":"default",boxShadow:grade&&nameInput.trim()?"0 4px 18px rgba(255,230,109,0.4)":"none",transition:"all 0.2s"}}>
            Let's Go! 🚀
          </button>
        </div>
      </div>
    </div>
  );

  // ── SUBJECTS HUB ──
  if(screen==="subjects") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",paddingBottom:36}}>
      <style>{CSS}</style>
      <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:"#FFE66D",fontSize:20,fontFamily:"'Fredoka One'"}}>✨ Clariva</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,marginTop:1}}>Hi {studentName}! · Grade {grade} LVUSD</div>
        </div>
        <div style={{display:"flex",gap:9,alignItems:"center"}}>
          <div style={{background:"rgba(255,230,109,0.12)",border:"1px solid rgba(255,230,109,0.25)",borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16}}>🪙</span>
            <span style={{color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:15}}>{coins}</span>
          </div>
          <button onClick={()=>setScreen("onboard")} style={{background:"rgba(255,255,255,0.07)",border:"none",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer",fontFamily:"'Nunito'"}}>✏️ Grade</button>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"18px 16px 6px"}}>
        <div style={{fontSize:38,display:"inline-block",animation:"float 3s ease-in-out infinite"}}>🌟</div>
        <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:21,marginTop:5}}>Choose a Subject</div>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:2}}>Grade {grade} curriculum · 10 levels each · earn coins</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,padding:"10px 13px",maxWidth:490,margin:"0 auto"}}>
        {SUBJECTS.map(subj=>{
          const units=getUnits(subj.id,grade);
          const gu=units.filter(u=>!u.beyondGrade);
          const earned=gu.reduce((s,u)=>s+Object.values(progress[subj.id]?.[u.id]||{}).reduce((a,b)=>a+b,0),0);
          const max=gu.length*10*3;
          const pct=max>0?Math.round((earned/max)*100):0;
          return(
            <div key={subj.id} className="card-hover" onClick={()=>{setActiveSubject(subj);setScreen("units");}}
              style={{background:`linear-gradient(135deg,${subj.color}18,${subj.color}08)`,border:`1.5px solid ${subj.color}30`,borderRadius:19,padding:"17px 13px",boxShadow:`0 4px 16px ${subj.color}12`}}>
              <div style={{fontSize:28,marginBottom:5}}>{subj.icon}</div>
              <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:15,marginBottom:3}}>{subj.label}</div>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginBottom:7,lineHeight:1.3}}>{subj.desc}</div>
              <Bar value={pct} color={subj.color}/>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,marginTop:3}}>{pct}% mastered</div>
            </div>
          );
        })}
      </div>
      {/* Coin store teaser */}
      <div style={{margin:"8px 13px 0",background:"rgba(255,230,109,0.07)",border:"1px solid rgba(255,230,109,0.18)",borderRadius:13,padding:"10px 14px",maxWidth:464,marginLeft:"auto",marginRight:"auto"}}>
        <div style={{display:"flex",gap:9,alignItems:"center"}}>
          <span style={{fontSize:22,flexShrink:0}}>🎮</span>
          <div style={{color:"rgba(255,230,109,0.7)",fontSize:12,lineHeight:1.5}}>
            <span style={{color:"#FFE66D",fontWeight:700}}>Earn coins</span> by completing levels — use them to unlock games! You have <span style={{color:"#FFE66D",fontWeight:700}}>🪙 {coins}</span> coins.
          </div>
        </div>
      </div>
    </div>
  );

  // ── UNITS ──
  if(screen==="units"){
    const units=getUnits(activeSubject.id,grade);
    const gradeUnits=units.filter(u=>!u.beyondGrade);
    const beyondUnits=units.filter(u=>u.beyondGrade);
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",paddingBottom:36}}>
        <style>{CSS}</style>
        <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:9}}>
          <button onClick={()=>setScreen("subjects")} className="btn-hover" style={{background:"rgba(255,255,255,0.08)",border:"none",color:"white",borderRadius:9,padding:"6px 13px",fontFamily:"'Nunito'",fontSize:13,cursor:"pointer"}}>← Subjects</button>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{activeSubject.icon} {activeSubject.label}</div>
          <div style={{marginLeft:"auto",color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:14}}>🪙 {coins}</div>
        </div>
        <div style={{textAlign:"center",padding:"0 16px 14px"}}>
          <div style={{fontSize:42,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>{activeSubject.icon}</div>
          <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:21,marginTop:5}}>{activeSubject.label}</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:2}}>Grade {grade} LVUSD · 10 levels per unit</div>
        </div>
        <div style={{padding:"0 13px",maxWidth:450,margin:"0 auto"}}>
          {gradeUnits.map(unit=>{
            const pct=getUnitPct(activeSubject.id,unit.id);
            return(
              <div key={unit.id} className="card-hover" onClick={()=>{setActiveUnit(unit);setScreen("levels");}}
                style={{background:`linear-gradient(135deg,${unit.color}18,${unit.color}08)`,border:`1.5px solid ${unit.color}30`,borderRadius:15,padding:"13px 15px",marginBottom:9,display:"flex",alignItems:"center",gap:11}}>
                <div style={{width:42,height:42,borderRadius:11,background:unit.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{unit.icon}</div>
                <div style={{flex:1}}>
                  <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:14}}>{unit.label}</div>
                  <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,marginBottom:4}}>{unit.standard}</div>
                  <Bar value={pct} color={unit.color}/>
                </div>
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>{pct}%</div>
              </div>
            );
          })}
          {beyondUnits.length>0&&<>
            <div style={{display:"flex",alignItems:"center",gap:9,margin:"16px 0 10px"}}>
              <div style={{flex:1,height:1,background:"rgba(255,230,109,0.18)"}}/>
              <div style={{background:"rgba(255,230,109,0.12)",border:"1px solid rgba(255,230,109,0.28)",borderRadius:18,padding:"4px 11px",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:13}}>🚀</span><span style={{color:"#FFE66D",fontSize:11,fontWeight:800,fontFamily:"'Fredoka One'"}}>Beyond Grade {grade}</span>
              </div>
              <div style={{flex:1,height:1,background:"rgba(255,230,109,0.18)"}}/>
            </div>
            {beyondUnits.map(unit=>{
              const pct=getUnitPct(activeSubject.id,unit.id);
              return(
                <div key={unit.id} className="card-hover" onClick={()=>{setActiveUnit(unit);setScreen("levels");}}
                  style={{background:`linear-gradient(135deg,${unit.color}10,${unit.color}05)`,border:"1.5px solid rgba(255,230,109,0.2)",borderRadius:15,padding:"13px 15px",marginBottom:9,display:"flex",alignItems:"center",gap:11}}>
                  <div style={{width:42,height:42,borderRadius:11,background:`${unit.color}88`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,position:"relative"}}>
                    {unit.icon}<div style={{position:"absolute",top:-4,right:-4,background:"#FFE66D",borderRadius:5,padding:"1px 4px",fontSize:8,color:"#1a1a2e",fontWeight:800}}>G{Number(grade)+1}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:14}}>{unit.label}</div>
                    <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,marginBottom:4}}>{unit.standard}</div>
                    <Bar value={pct} color={unit.color}/>
                  </div>
                  <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>{pct}%</div>
                </div>
              );
            })}
          </>}
        </div>
      </div>
    );
  }

  // ── LEVELS (10 per unit) ──
  if(screen==="levels"){
    const allLevels = activeUnit ? getLevelsFor(activeUnit) : [];
    const tierColors = {grade:"#4ECDC4", extended:"#FFE66D", beyond:"#C3A6FF"};
    const tierLabels = {grade:"📚 Curriculum", extended:"⚡ Challenge", beyond:"🚀 Beyond"};
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",paddingBottom:36}}>
        <style>{CSS}</style>
        <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:9}}>
          <button onClick={()=>setScreen("units")} className="btn-hover" style={{background:"rgba(255,255,255,0.08)",border:"none",color:"white",borderRadius:9,padding:"6px 13px",fontFamily:"'Nunito'",fontSize:13,cursor:"pointer"}}>← Units</button>
          <div style={{marginLeft:"auto",color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:14}}>🪙 {coins}</div>
        </div>
        <div style={{textAlign:"center",padding:"0 16px 16px"}}>
          <div style={{fontSize:44,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>{activeUnit?.icon}</div>
          <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:21,marginTop:5}}>{activeUnit?.label}</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,marginTop:4}}>{activeUnit?.standard}</div>
          {/* Coin multiplier legend */}
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
            {Object.entries(tierLabels).map(([t,label])=>(
              <div key={t} style={{background:`${tierColors[t]}18`,border:`1px solid ${tierColors[t]}44`,borderRadius:20,padding:"3px 10px",fontSize:10,color:tierColors[t],fontWeight:700}}>{label} {t==="beyond"?"×2 coins":t==="extended"?"×1.5 coins":"×1 coins"}</div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 13px",maxWidth:420,margin:"0 auto"}}>
          {allLevels.map((level,i)=>{
            const stars=getStarsFor(activeSubject.id,activeUnit.id,i);
            const locked=i>0&&getStarsFor(activeSubject.id,activeUnit.id,i-1)===0;
            const tc=tierColors[level.tier];
            const coinsForLevel=calcCoins(90,i); // show max possible
            const isNewTier=i===0||(allLevels[i-1]?.tier!==level.tier);
            return(
              <div key={i}>
                {isNewTier&&i>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0 6px"}}>
                    <div style={{flex:1,height:1,background:`${tc}33`}}/>
                    <div style={{color:tc,fontSize:11,fontWeight:800,fontFamily:"'Fredoka One'"}}>{tierLabels[level.tier]}</div>
                    <div style={{flex:1,height:1,background:`${tc}33`}}/>
                  </div>
                )}
                <div onClick={()=>!locked&&startQuiz(activeUnit,i)} className={locked?"":"card-hover"}
                  style={{background:locked?"rgba(255,255,255,0.02)":`linear-gradient(135deg,${tc}18,${tc}08)`,border:`1.5px solid ${locked?"rgba(255,255,255,0.06)":tc+"40"}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:locked?0.35:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:36,height:36,borderRadius:9,background:locked?"rgba(255,255,255,0.05)":tc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontFamily:"'Fredoka One'",color:"#1a1a2e",fontWeight:900}}>{locked?"🔒":i+1}</div>
                    <div>
                      <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:14}}>Level {i+1} <span style={{color:tc,fontSize:11}}>· {level.label}</span></div>
                      <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>Up to 🪙 {coinsForLevel} coins</div>
                    </div>
                  </div>
                  <Stars count={stars}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if(screen==="quiz"){
    const q=questions[qIndex];
    if(!q)return null;
    const timerColor=timeLeft<=5?"#FF6B6B":timeLeft<=10?"#FFE66D":"#4ECDC4";
    const pct=Math.round((qIndex/TOTAL_Q)*100);
    const diff=difficulty(activeLevel);
    const tierColor={grade:"#4ECDC4",extended:"#FFE66D",beyond:"#C3A6FF"}[diff.tier];
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS}</style>
        {showTutor&&q&&<TutorPanel question={q} unitLabel={activeUnit.label} subject={activeSubject.id} grade={grade} wrongAnswer={wrongAnswer} color={activeUnit.color} levelIdx={activeLevel} onContinue={()=>advance(false)}/>}
        <div style={{background:"rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"11px 13px",display:"flex",alignItems:"center",gap:9}}>
          <button onClick={()=>setScreen("levels")} style={{background:"rgba(255,255,255,0.07)",border:"none",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"5px 9px",fontFamily:"'Nunito'",fontSize:12,cursor:"pointer"}}>✕</button>
          <div style={{flex:1}}><Bar value={pct} color={tierColor}/></div>
          <div style={{background:`${tierColor}22`,borderRadius:7,padding:"2px 8px",fontSize:10,color:tierColor,fontWeight:800}}>L{activeLevel+1} · {diff.label}</div>
          <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{qIndex}/{TOTAL_Q}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 13px",alignItems:"center"}}>
          <div style={{background:`${timerColor}18`,border:`1.5px solid ${timerColor}44`,borderRadius:9,padding:"5px 11px",display:"flex",alignItems:"center",gap:4,animation:timeLeft<=5?"pulse 0.7s infinite":"none"}}>
            <span style={{fontSize:12}}>⏱</span><span style={{color:timerColor,fontFamily:"'Fredoka One'",fontSize:17}}>{timeLeft}</span>
          </div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,textAlign:"center"}}>
            <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:12}}>{activeUnit?.label}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{background:"rgba(255,230,109,0.1)",border:"1px solid rgba(255,230,109,0.22)",borderRadius:9,padding:"5px 11px",display:"flex",alignItems:"center",gap:3}}>
              <span style={{fontSize:12}}>🪙</span><span style={{color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:16}}>{coins}</span>
            </div>
          </div>
        </div>
        {streakCount>=3&&feedback==="correct"&&<div style={{textAlign:"center",color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:16,animation:"pop 0.3s ease-out"}}>🔥 {streakCount} in a row!</div>}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"11px 13px"}}>
          <div style={{background:"rgba(255,255,255,0.06)",border:`2px solid ${tierColor}30`,borderRadius:19,padding:"20px 17px",width:"100%",maxWidth:420,textAlign:"center",marginBottom:14,animation:"pop 0.3s ease-out"}}>
            <div style={{color:"rgba(255,255,255,0.25)",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:7}}>{activeSubject?.label.toUpperCase()} · Q{qIndex+1} OF {TOTAL_Q}</div>
            <div style={{color:"white",fontFamily:"'Fredoka One'",fontSize:q.text?.length>70?16:q.text?.length>40?20:26,lineHeight:1.4}}>{q.text}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%",maxWidth:420}}>
            {q.choices?.map((choice,i)=>{
              let bg="rgba(255,255,255,0.06)",border="rgba(255,255,255,0.1)",textColor="white",anim="";
              if(selected!==null){
                if(String(choice)===String(q.answer)){bg="rgba(78,205,196,0.18)";border="#4ECDC4";textColor="#4ECDC4";}
                else if(String(choice)===String(selected)){bg="rgba(255,107,107,0.18)";border="#FF6B6B";textColor="#FF6B6B";anim="shake 0.3s ease-out";}
              }
              const long=String(choice).length>12;
              return(
                <button key={i} onClick={()=>handleAnswer(choice)} className={selected===null?"choice-btn":""}
                  style={{background:bg,border:`2px solid ${border}`,borderRadius:12,padding:long?"11px 7px":"14px 7px",color:textColor,fontFamily:"'Fredoka One'",fontSize:long?12:20,cursor:selected!==null?"default":"pointer",animation:anim,lineHeight:1.3}}>
                  {choice}
                </button>
              );
            })}
          </div>
          {feedback==="correct"&&<div style={{marginTop:12,color:"#4ECDC4",fontFamily:"'Fredoka One'",fontSize:19,animation:"pop 0.3s ease-out"}}>Correct! Well done!</div>}
          {feedback==="wrong"&&!showTutor&&<div style={{marginTop:12,color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:15,animation:"pop 0.3s ease-out"}}>Max is reviewing this with you...</div>}
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if(screen==="result"){
    const pct=lastPct;
    const stars=pct>=STAR_T[2]?3:pct>=STAR_T[1]?2:pct>=STAR_T[0]?1:0;
    const diff=difficulty(activeLevel);
    const allLevels=activeUnit?getLevelsFor(activeUnit):[];
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29,#302b63,#24243e)",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <style>{CSS}</style>
        {showCoinModal&&<CoinModal coins={lastCoins} pct={pct} levelLabel={`Level ${activeLevel+1} · ${diff.label}`} tier={diff.tier} onClose={()=>setShowCoinModal(false)}/>}
        <div style={{background:"rgba(255,255,255,0.06)",border:`2px solid ${activeUnit.color}30`,borderRadius:24,padding:"24px 20px",width:"100%",maxWidth:350,textAlign:"center",animation:"pop 0.4s ease-out"}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,marginBottom:6}}>Level {activeLevel+1} · {diff.label}</div>
          <div style={{fontFamily:"'Fredoka One'",fontSize:54,marginBottom:4,background:`linear-gradient(90deg,${activeUnit.color},white,${activeUnit.color})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 2s linear infinite"}}>{pct}%</div>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:10}}>{score} / {TOTAL_Q} correct</div>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:14}}>
            {[1,2,3].map(i=><span key={i} style={{fontSize:24,filter:i<=stars?"none":"grayscale(1) opacity(0.2)",animation:i<=stars?`pop ${0.15+i*0.1}s ease-out both`:"none"}}>⭐</span>)}
          </div>
          <div style={{background:"rgba(255,230,109,0.1)",border:"1px solid rgba(255,230,109,0.25)",borderRadius:12,padding:"10px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{fontSize:22}}>🪙</span>
            <div>
              <div style={{color:"#FFE66D",fontFamily:"'Fredoka One'",fontSize:20}}>+{lastCoins} coins</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>Total: {coins} coins</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button className="btn-hover" onClick={()=>startQuiz(activeUnit,activeLevel)} style={{background:activeUnit.color,border:"none",borderRadius:12,padding:12,color:"#1a1a2e",fontFamily:"'Fredoka One'",fontSize:15,boxShadow:`0 4px 12px ${activeUnit.color}44`}}>🔄 Try Again</button>
            {activeLevel<allLevels.length-1&&stars>=1&&<button className="btn-hover" onClick={()=>startQuiz(activeUnit,activeLevel+1)} style={{background:"rgba(255,255,255,0.08)",border:`1.5px solid ${activeUnit.color}40`,borderRadius:12,padding:12,color:"white",fontFamily:"'Fredoka One'",fontSize:15}}>⬆️ Next Level</button>}
            <button className="btn-hover" onClick={()=>setScreen("units")} style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:12,padding:12,color:"rgba(255,255,255,0.5)",fontFamily:"'Fredoka One'",fontSize:15}}>📚 More Units</button>
            <button className="btn-hover" onClick={()=>setScreen("subjects")} style={{background:"transparent",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:12,padding:12,color:"rgba(255,255,255,0.3)",fontFamily:"'Fredoka One'",fontSize:15}}>🏠 All Subjects</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}