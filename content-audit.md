# Mot Juste — Content Audit: Questions That Give Away the Answer

Read through all 115 cards in `src/data/cards.json`. About **46 cards (40%)** have some form of leakage — the `story` text states, quotes, or so precisely paraphrases the answer that no real vocabulary knowledge is needed to win. Grouped by severity below, worst first, with the exact leak quoted and a concrete fix for each.

Two recurring root causes, worth fixing at the pattern level rather than card-by-card:

1. **Eponym/loanword cards name the source word, and the source word IS the answer, spelled identically or near-identically** (Nemesis, Mentor, Maverick, Sinister, Caveat emptor, Bedlam, Malaria, Gerrymander, Toska, Flâneur, Zeitgeist, Weltanschauung, Angst). This is close to unavoidable for true eponyms (you have to name the person/place), but the *reveal sentence* is usually what does the damage — cutting or rewording just that one sentence fixes most of these.
2. **Idiom/proverb/maxim cards quote the historical figure saying (a version of) the actual phrase**, because that's often literally how the etymology anecdote is told (e.g. Nelson's "blind eye," Dennis shouting "steal my thunder"). These need the quote paraphrased or truncated before the giveaway word.

---

## Critical — the answer (or a near-identical form of it) appears verbatim in the story

| # | id | category | The leak | Fix |
|---|---|---|---|---|
| 5 | parochial | Mot Juste | Story quotes the colleague's reply in full: *"I think I've gone from the provincial to the parochial."* | Cut the direct quote. Say the colleague "topped it with a single word that did what a whole sentence couldn't" — describe the effect, don't print the word. |
| 13 | steal-someones-thunder | Idiom | Dennis is quoted shouting *"they steal my thunder!"* | Truncate the quote before the payoff: *"He reportedly stood up and shouted that they'd taken something of his that night belonged to him alone."* |
| 15 | break-a-leg | Idiom | *"a successful show meant bowing so many times you'd 'break' the leg you bent at the knee"* | Drop the quoted verb. *"...bowing so many times your knee gave out."* |
| 32 | boycott | Mot Juste | Protagonist's surname literally *is* the answer, stated repeatedly (*"Captain Charles Boycott"*). | Hardest to fully fix (it's a true eponym), but delay/obscure the surname: introduce him only as "a land agent in County Mayo" and don't reveal "Boycott" as his name until the reveal card, not the story. |
| 39 | nemesis | Mot Juste | *"Nemesis was the goddess of retribution..."* — proper noun = answer exactly. | Refer to her only as "the goddess of retribution" throughout; save the name for the reveal. |
| 41 | mentor | Mot Juste | *"Mentor was an old friend of Odysseus..."* — same issue, exact match. | Refer to him as "an old friend left behind to watch the household" and withhold the name until the reveal. |
| 44 | sinister | Mot Juste | *"'Sinister' was simply the Latin word for 'left.'"* — quotes the answer directly. | *"The Latin word for 'left' carried the same omen."* — drop the quoted term itself. |
| 45 | bedlam | Mot Juste | *"'Bethlem' slurred in common speech into 'Bedlam.'"* | *"'Bethlem' slurred in common speech into the word we still use for chaos today."* |
| 48 | gerrymander | Mot Juste | The story spells it out directly: *"not a salamander — a Gerry-mander."* | End the anecdote one beat earlier: *"Another replied that it looked more like some new kind of animal — half Gerry, half salamander."* Let the player assemble it. |
| 51 | malaria | Mot Juste | *"mala aria"* — literally the answer split into two words. | *"The Italian for 'bad air' seemed explanation enough."* — drop the literal Italian phrase, since it's just the answer with a space in it. |
| 52 | maverick | Mot Juste | *"any unbranded steer... became known as a 'maverick'"* | *"any unbranded steer found wandering the range took on the rancher's own name."* |
| 56 | weltanschauung | Loanword | *"'Welt' means world; 'anschauung' means view."* — the two halves spell the compound answer. | Cut the literal gloss; just say *"the word fuses 'world' and 'view.'"* (translate the meaning, don't print the German morphemes). |
| 58 | zeitgeist | Loanword | Same pattern: *"'Zeit' is time; 'Geist' is spirit."* | *"The word fuses time and spirit."* |
| 59 | flaneur | Loanword | *"the flâneur moved through the city as a connoisseur of it"* — uses the answer mid-story. | *"Not lost and not purposeless: this figure moved through the city as a connoisseur of it."* |
| 61 | under-the-weather | Idiom | *"The sick sailor was literally under the weather"* — states the full answer. | *"The sick sailor was, in the most literal sense, beneath the deck that took the storm."* |
| 66 | caught-red-handed | Idiom | *"'Red-handed' meant physically, literally undeniable"* | *"The blood itself was the only evidence needed — no confession, no witness, just the stain."* |
| 78 | know-thyself | Maxim | Gives the English translation outright: *"'Gnothi seauton.' Know thyself."* | Stop at the Greek: *"a two-word inscription in Greek: 'Gnothi seauton.'"* Let the story explain what it means about self-knowledge without printing the English translation. |
| 90 | toska | Loanword | Nabokov's own quote contains the word: *"No single word in English renders all the shades of toska."* | Paraphrase Nabokov instead of quoting him directly, or quote only the descriptive back half: *"...'a dull ache of the soul, a longing with nothing to long for, a sick pining, a vague restlessness.'"* |
| 103 | all-that-glitters | Proverb | Quotes the near-identical original: *"'all that glisters is not gold'"* | Reference the misquote fact without printing the line: *"Shakespeare's actual word was 'glisters,' not the one everyone quotes — but four centuries of misquotation won out."* |
| 105 | caveat-emptor | Proverb | The answer is printed outright: *"'Caveat emptor' — let the buyer beware..."* | Give the English meaning without the Latin: *"Roman law had a name for this, three words that put the burden of due diligence entirely on the buyer."* |

---

## High — not verbatim, but the imagery or paraphrase leaves nothing to infer

| # | id | category | The leak | Fix |
|---|---|---|---|---|
| 1 | bite-the-bullet | Idiom | *"surgeons handed them a lead bullet to clench between their teeth"* | Remove "clench between their teeth" — end on *"gave them a lead bullet to bear down on."* |
| 12 | turning-a-blind-eye | Idiom | *"Nelson held his telescope to his blind eye"* | *"Nelson held his telescope to the eye that had lost its sight years before"* — avoid the phrase "blind eye" as a unit. |
| 16 | gift-horse | Idiom | *"Checking the teeth of a gifted horse... you didn't do it."* | Keep the teeth/age detail (it's the interesting fact) but cut "the etiquette was clear: you didn't do it" — that line states the moral directly. |
| 50 | assassin | Mot Juste | *"brought the word back as 'assassini.'"* | *"brought the term back garbled into a new Crusader word for a hired killer"* — don't print the transliteration. |
| 60 | angst | Loanword | *"used 'Angest' to describe..."* | *"used a German word for..."* — drop the near-identical spelling. |
| 64 | let-the-cat-out-of-the-bag | Idiom | *"would let the cat out, revealing the deception"* | *"would discover the switch before the sale went through"* — describe the discovery without the cat imagery. |
| 86 | bury-the-hatchet | Idiom | *"a hatchet interred beneath a great tree"* | *"a weapon interred beneath a great tree"* — swap "hatchet" for "weapon" (already used once in the prior sentence). |
| 99 | berserk | Mot Juste | *"warriors known as 'berserkers'"* — contains the answer as its first seven letters. | *"warriors known by a name that meant 'bear-shirts'"* — describe the etymology without printing the -erker(s) form. |
| 101 | blood-is-thicker-than-water | Proverb | Quotes the alternate version almost word for word: *"'The blood of the covenant is thicker than the water of the womb.'"* | Paraphrase instead of quoting: *"a longer version that reverses the moral entirely — bonds sworn through shared experience outrank the accident of birth."* |
| 102 | lead-a-horse-to-water | Proverb | *"you could bring a horse to water, but horses drank only when they chose to"* | *"you could compel the animal's presence but not its cooperation"* — keep the idea, lose the horse/water/drink words. |
| 106 | not-my-circus | Idiom | *"The circus is their chaos; the monkeys are their people."* | Cut this sentence entirely — it's an unnecessary gloss that hands over both key nouns. |
| 107 | fish-rots-from-head | Proverb | *"fish do not actually rot from the head first"* | *"the proverb has the biology backwards"* — state the correction without repeating the phrase. |
| 110 | apple-tree | Proverb | *"The apple lands near the tree. Not on top of it."* | Cut the final two sentences — the story already makes the point without restating it in proverb form. |
| 113 | plant-a-tree | Proverb | *"The second-best time is the only time you actually have."* | *"The regret is real but unactionable; what's left is only ever the present moment."* — avoid "second-best time," which is straight out of the answer. |
| 115 | journey-thousand-miles | Maxim | *"a thousand-league journey begins from where you stand"* | Keep the Chinese, drop the English gloss, or gloss it more loosely: *"the point isn't the distance ahead — it's wherever your feet already are."* |
| 83 | when-in-rome | Proverb | *"when he was in Rome, he fasted on Saturday; when in Milan, he didn't"* | *"he answered simply: match the local custom, wherever you happen to be."* |

---

## Moderate — one key word or the underlying structure is given away

| # | id | category | The leak | Fix |
|---|---|---|---|---|
| 10 | spill-the-beans | Idiom | Beans + a jar knocked over, right before the reveal. | Fine as historical color, but move the "if someone accidentally knocked the jar over" detail earlier, away from the final sentence, so it's not the last image before the answer. |
| 14 | pass-the-buck | Idiom | *"the buck"* named twice, plus *"slide the marker to someone else."* | Call it "the marker" throughout and only reveal it was nicknamed "the buck" in the reveal card, not the story. |
| 23 | count-your-chickens | Proverb | *"the eggs will hatch"* — shares the answer's key verb. | *"the eggs will become chicks"* — avoid "hatch." |
| 29 | friendly-fire | Euphemism | Quotes *"'friendly'"* directly. | *"described these deaths using the gentlest word available"* — don't quote the word itself. |
| 68 | on-the-nose | Idiom | *"pointed to the nose... you are exactly on time"* | Keep the gesture, cut "exactly on time" as the direct payoff — let the player connect timing to the idiom. |
| 77 | little-learning | Epigram | Flags "learning" as the correct word vs. the common misquote "knowledge." | Cut the "constantly misquoted as..." aside — it's a nice fact but hands over the answer's exact noun by contrast. |
| 89 | bite-the-dust | Idiom | *"Greek warriors 'biting the sacred earth' as they fall"* | *"Greek warriors falling face-down in combat"* — drop "biting." |
| 95 | ethnic-cleansing | Euphemism | Quotes *"'cleansing'"* directly. | *"implied hygiene, purification, something reasonable"* — keep the effect, cut the quoted word. |
| 8 | stitch-in-time | Proverb | *"one stitch... nine"* mirrors the proverb's exact numbers. | Change the numbers in the illustrative anecdote (e.g., "one repair now vs. a dozen later") so the count doesn't match the proverb's "nine" precisely. |
| 109 | broken-clock | Adage | *"twice every 24 hours, pure chance makes it accurate"* | *"a certain fixed number of times a day, purely by chance, it happens to be right"* — avoid stating "twice" and "day" together, which maps 1:1 onto the answer. |

---

## Not flagged, but worth knowing about (design pattern, not a bug)

Most of the **Mot Juste** eponym cards (draconian, panic, narcissistic, tantalize, laconic, sycophant, serendipity, pyrrhic-victory, dunce, sardonic, ostracize, sabotage, quixotic) name the root person/place but require a suffix change to get to the answer (Narcissus → *narcissistic*, Pan → *panic*, Draco → *draconian*). That's a fair level of difficulty — the player still has to do real morphological work — so I left these alone. The ones flagged above are the cases where the root word and the answer are spelled identically or near-identically, which removes that step entirely.

## Suggested next step

I can go ahead and apply the Critical-tier fixes (and the High tier, if you want) directly to `cards.json` — happy to do that now if you'd like, or you can work through this list at your own pace. Let me know which.
