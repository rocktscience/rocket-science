// lib/constants/musicData.ts

// Countries list (ISO standard)
export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Territories for distribution
export const territories = [
  'World', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania',
  'Caribbean', 'Central America', 'Middle East', 'Sub-Saharan Africa', 'North Africa',
  'East Asia', 'South Asia', 'Southeast Asia', 'Central Asia', 'Western Europe',
  'Eastern Europe', 'Northern Europe', 'Southern Europe', 'LATAM', 'MENA',
  'GCC Countries', 'Commonwealth', 'EU', 'ASEAN', 'BRICS'
];

// Genre to Subgenre mapping
export const genreSubgenreMap: Record<string, string[]> = {
  'African': ['African Dancehall', 'African Reggae', 'Afrikaans', 'Afro House', 'Afro Soul', 'Afro-Beat', 'Afro-folk', 'Afro-Jazz', 'Afro-Pop', 'Afro-Fusion', 'Amapiano', 'Benga', 'Bikutsi', 'Bongo Flava', 'Coupé-Décalé', 'Ethiopian', 'Gqom', 'Highlife', 'Hiplife', 'Kizomba', 'Kuduro', 'Kwaito', 'Makossa', 'Mbalax', 'Ndombolo', 'Nigerian', 'Palm-Wine', 'Soukous', 'Taarab', 'Zouk'],
  'Alternative': ['Adult Alternative', 'Alternative Folk', 'American Traditional Rock', 'Arena Rock', 'Blues-Rock', 'College Rock', 'Dancepunk', 'Dream Pop', 'Emo', 'Funk Rock', 'Garage Rock', 'Glam Rock', 'Grunge', 'Hard Rock', 'Indie Pop', 'Indie Rock', 'Industrial Rock', 'Jam Bands', 'Lo-fi', 'Math Rock', 'Mod', 'New Wave', 'Noise Pop', 'Pop Punk', 'Post Punk', 'Post Rock', 'Power Pop', 'Prog-Rock', 'Psychedelic', 'Punk', 'Rockabilly', 'Shoegaze', 'Ska Punk', 'Softcore', 'Steampunk', 'Surf', 'Tex-Mex'],
  'Blues': ['Acoustic Blues', 'British Blues', 'Chicago Blues', 'Classic Blues', 'Contemporary Blues', 'Country Blues', 'Delta Blues', 'Detroit Blues', 'Electric Blues', 'Harmonica Blues', 'Hill Country Blues', 'Jump Blues', 'Louisiana Blues', 'Memphis Blues', 'Modern Blues', 'New Orleans Blues', 'Piedmont Blues', 'Piano Blues', 'Soul Blues', 'St. Louis Blues', 'Swamp Blues', 'Texas Blues', 'Urban Blues', 'West Coast Blues'],
  'Brazilian': ['Axé', 'Baião', 'Baile Funk', 'Bossa Nova', 'Brega', 'Bregafunk', 'Choro', 'Forró', 'Frevo', 'Funk Carioca', 'Mangue Beat', 'Marchinha', 'Maracatu', 'MPB', 'Pagode', 'Pisadinha', 'Piseiro', 'Samba', 'Samba Enredo', 'Samba Rock', 'Sertanejo', 'Sertanejo Universitário', 'Tecnobrega', 'Tropicália', 'Xote'],
  'Country': ['Alternative Country', 'Americana', 'Bluegrass', 'Classic Country', 'Contemporary Bluegrass', 'Contemporary Country', 'Country Gospel', 'Country Pop', 'Country Rock', 'Honky Tonk', 'Modern Country', 'Outlaw Country', 'Traditional Bluegrass', 'Traditional Country', 'Urban Cowboy', 'Western Swing'],
  'Dance': ['Big Room', 'Breakbeat', 'Breakcore', 'Dancehall', 'Deep House', 'Disco', 'Drum and Bass', 'Dub', 'Electro', 'Electro House', 'Electronic Dance Music', 'Eurodance', 'Exercise', 'Future Bass', 'Future House', 'Garage', 'Hardstyle', 'House', 'Jungle', 'Latin EDM', 'Melodic House & Techno', 'Moombahton', 'Progressive House', 'Reggaeton', 'Tech House', 'Techno', 'Trance', 'Trap', 'Tropical House', 'UK Garage'],
  'Electronic': ['Ambient', 'Bass', 'Downtempo', 'Dubstep', 'Electro', 'Electronica', 'IDM/Experimental', 'Industrial', 'Leftfield', 'Trip Hop'],
  'Folk': ['American Folk', 'Anti-Folk', 'British Folk', 'Celtic', 'Celtic Folk', 'Contemporary Folk', 'Folk-Rock', 'German Folk', 'Indie Folk', 'Irish Folk', 'Neo-Folk', 'Nordic Folk', 'Progressive Folk', 'Psychedelic Folk', 'Scottish Folk', 'Singer-Songwriter', 'Traditional Folk', 'World Folk'],
  'Hip-Hop/Rap': ['Alternative Rap', 'Bounce', 'Dirty South', 'East Coast Rap', 'French Rap', 'Gangsta Rap', 'German Hip Hop', 'Hardcore Rap', 'Hip-Hop', 'Instrumental Hip Hop', 'Jazz Rap', 'Latin Hip Hop', 'Midwest Rap', 'Old School Rap', 'Rap', 'Trap', 'Trip Hop', 'UK Hip Hop', 'Underground Rap', 'West Coast Rap'],
  'Jazz': ['Acid Jazz', 'Afro-Cuban Jazz', 'Avant-Garde Jazz', 'Bebop', 'Big Band', 'Bossa Nova', 'Chamber Jazz', 'Contemporary Jazz', 'Cool Jazz', 'Crossover Jazz', 'Dixieland', 'Free Jazz', 'Funk', 'Fusion', 'Gypsy Jazz', 'Hard Bop', 'Jazz Blues', 'Jazz Funk', 'Jazz Fusion', 'Jazz Vocals', 'Latin Jazz', 'Mainstream Jazz', 'Modern Jazz', 'Neo-Bop', 'Nu Jazz', 'Post-Bop', 'Ragtime', 'Smooth Jazz', 'Soul Jazz', 'Swing', 'Third Stream', 'Trad Jazz', 'Vocal Jazz', 'West Coast Jazz'],
  'Latin': ['Alternative & Rock in Spanish', 'Bachata', 'Baladas y Boleros', 'Banda', 'Bolero', 'Bossa Nova', 'Contemporary Latin', 'Corrido', 'Cumbia', 'Dembow', 'Duranguense', 'Flamenco', 'Latin Funk', 'Latin Jazz', 'Latin Pop', 'Latin Rock', 'Latin Urban', 'Mambo', 'Mariachi', 'Merengue', 'Norteño', 'Nueva Canción', 'Perreo', 'Pop in Spanish', 'Raíces', 'Ranchera', 'Reggaeton', 'Regional Mexicano', 'Rumba', 'Salsa', 'Salsa y Tropical', 'Son', 'Tango', 'Tejano', 'Timba', 'Trap Latino', 'Vallenato'],
  'Pop': ['Adult Contemporary', 'Afrikaans Pop', 'Alt-Pop', 'Art Pop', 'Baroque Pop', 'Bedroom Pop', 'Britpop', 'Bubblegum Pop', 'C-Pop', 'Chamber Pop', 'Chinese Pop', 'City Pop', 'Classic Pop', 'Contemporary Pop', 'Dance Pop', 'Dark Pop', 'Dream Pop', 'Electropop', 'Europop', 'Folk Pop', 'Hyperpop', 'Indie Pop', 'J-Pop', 'K-Pop', 'Latin Pop', 'New Romantic', 'Noise Pop', 'Orchestral Pop', 'Pop', 'Pop Punk', 'Pop Rock', 'Power Pop', 'Progressive Pop', 'Psychedelic Pop', 'Russian Pop', 'Sophisti-Pop', 'Sunshine Pop', 'Synth-Pop', 'Teen Pop', 'Traditional Pop', 'Turkish Pop', 'Twee Pop', 'Vocal Pop'],
  'R&B/Soul': ['Alternative R&B', 'Contemporary R&B', 'Deep Soul', 'Disco', 'Doo Wop', 'Funk', 'Gospel', 'Memphis Soul', 'Motown', 'Neo-Soul', 'Northern Soul', 'Philadelphia Soul', 'Psychedelic Soul', 'Quiet Storm', 'Rhythm & Blues', 'Soul', 'Southern Soul', 'Traditional R&B', 'Urban Contemporary'],
  'Reggae': ['Dancehall', 'Dub', 'Lovers Rock', 'Modern Reggae', 'Ragga', 'Reggae', 'Reggae Fusion', 'Reggaeton', 'Roots Reggae', 'Ska'],
  'Rock': ['Acid Rock', 'Album Rock', 'Alternative Rock', 'Arena Rock', 'Art Rock', 'Blues Rock', 'British Invasion', 'Classic Rock', 'Death Metal', 'Emo', 'Experimental Rock', 'Folk Rock', 'Funk Rock', 'Garage Rock', 'Glam Rock', 'Gothic Rock', 'Grunge', 'Hard Rock', 'Heavy Metal', 'Indie Rock', 'Jam Rock', 'Krautrock', 'Math Rock', 'Metal', 'New Wave', 'Noise Rock', 'Pop Rock', 'Post-Grunge', 'Post-Punk', 'Post-Rock', 'Prog Rock', 'Psychedelic Rock', 'Punk Rock', 'Rock & Roll', 'Rockabilly', 'Shoegaze', 'Soft Rock', 'Southern Rock', 'Space Rock', 'Stoner Rock', 'Surf Rock', 'Symphonic Rock']
};

// Writer roles from the Excel file
export const writerRoles = [
  'Adapter', 'Adapter (Religious Text)', 'Adapter (Traditional Text)', 'Arranger', 
  'Arranger (Traditional)', 'Assistant Arranger', 'Based on the Work of', 'Book', 
  'Brass Arranger', 'Cadenza', 'Choir Arranger', 'Chorus Arranger', 'Co-Arranger', 
  'Co-Composer', 'Composer', 'Composition Ascribed to', 'Copyist', 'Horn Arranger', 
  'Keyboard Arranger', 'Librettist', 'Libretto Editing', 'Lyrics', 'Orchestrator', 
  'Percussion Arranger', 'Poetry', 'Reconstruction', 'Revision', 'Saxophone Arranger', 
  'Score Editor', 'Score Preparation', 'Screenwriter', 'Songwriter', 'String Arranger', 
  'Text', 'Transcription', 'Translation', 'Trumpet Arranger', 'Vocal Adapter', 
  'Vocal Arranger', 'Wind Arranger', 'Woodwind Arranger', 'Writer'
];

// Production and Engineering roles from the Excel file
export const productionRoles = [
  'Additional Engineer', 'Additional Producer', 'Art Production', 'Assistant Editing Engineer',
  'Assistant Engineer', 'Assistant Mastering Engineer', 'Assistant Mixing Engineer',
  'Assistant Producer', 'Assistant Recording Engineer', 'Assistant Strings Engineer',
  'Associate Producer', 'Audio Processing', 'Audio Restoration', 'Audio Technician',
  'Balance Engineer', 'Bass Technician', 'Camera Operator', 'Choreography', 'Cinematography',
  'Co-Producer', 'Compilation Producer', 'Creative Director', 'Design', 'Dialog Editor',
  'Digital Editor', 'Digital Mastering', 'Director', 'Drum Programmer', 'Drum Technician',
  'Editing', 'Editing Engineer', 'Effects', 'Engineer', 'Equipment Engineer', 'Executive Producer',
  'Field Recording', 'Film Director', 'Foley Artist', 'Guitar Technician', 'Horn Engineer',
  'Keyboards Technician', 'Lacquer Cut', 'Lead Engineer', 'Lighting Director', 'Live Sound',
  'Location Recording', 'Mastering', 'Mastering Engineer', 'Microphone Technician',
  'Mix Assistant', 'Mix Engineer', 'Mixing', 'Mixing Engineer', 'Mobile Recording',
  'Music Director', 'Music Supervisor', 'Orchestra Technician', 'Overdub Engineer',
  'Piano Technician', 'Post Production', 'Pre-Production', 'Producer', 'Production Assistant',
  'Production Coordination', 'Production Manager', 'Programming', 'Project Coordinator',
  'Recording', 'Recording Engineer', 'Recording Producer', 'Re-mastering', 'Remote Recording',
  'Remix', 'Restoration', 'Score Producer', 'Second Engineer', 'Senior Engineer',
  'Sound Designer', 'Sound Editor', 'Sound Effects', 'Sound Engineer', 'Sound Supervisor',
  'Stage Technician', 'String Engineer', 'Strings Engineer', 'Studio Assistant',
  'Studio Personnel', 'Surround Mix', 'Technical Producer', 'Transfer', 'Vocal Engineer',
  'Vocal Producer', 'Vocal Recording', 'Vocal Tuning', 'Voice Editing'
];

// Performer roles (sample from the Excel file)
export const performerRoles = [
  'Lead Vocals', 'Background Vocals', 'Choir', 'Vocalist', 'Featured Artist',
  'Acoustic Guitar', 'Electric Guitar', 'Bass Guitar', 'Drums', 'Percussion',
  'Piano', 'Keyboards', 'Synthesizer', 'Violin', 'Viola', 'Cello', 'Double Bass',
  'Trumpet', 'Trombone', 'Saxophone', 'Clarinet', 'Flute', 'French Horn',
  'Harp', 'Accordion', 'Banjo', 'Mandolin', 'Ukulele', 'Harmonica', 'Organ',
  'String Section', 'Horn Section', 'Orchestra', 'Chamber Orchestra', 'Ensemble',
  'DJ', 'Turntables', 'Sampler', 'Beatbox', 'Rapper', 'MC', 'Conductor',
  'Solo Artist', 'Band', 'Group', 'Quartet', 'Trio', 'Duo'
];

// PRO/CMO organizations
export const proOrganizations = [
  { code: 'ASCAP', name: 'ASCAP', country: 'United States' },
  { code: 'BMI', name: 'BMI', country: 'United States' },
  { code: 'SESAC', name: 'SESAC', country: 'United States' },
  { code: 'PRS', name: 'PRS for Music', country: 'United Kingdom' },
  { code: 'SACEM', name: 'SACEM', country: 'France' },
  { code: 'GEMA', name: 'GEMA', country: 'Germany' },
  { code: 'SIAE', name: 'SIAE', country: 'Italy' },
  { code: 'SGAE', name: 'SGAE', country: 'Spain' },
  { code: 'SABAM', name: 'SABAM', country: 'Belgium' },
  { code: 'BUMA', name: 'BUMA/STEMRA', country: 'Netherlands' },
  { code: 'SUISA', name: 'SUISA', country: 'Switzerland' },
  { code: 'SOCAN', name: 'SOCAN', country: 'Canada' },
  { code: 'APRA', name: 'APRA AMCOS', country: 'Australia' },
  { code: 'JASRAC', name: 'JASRAC', country: 'Japan' },
  { code: 'KOMCA', name: 'KOMCA', country: 'South Korea' },
  { code: 'SACM', name: 'SACM', country: 'Mexico' },
  { code: 'SCD', name: 'SCD', country: 'Chile' },
  { code: 'SADAIC', name: 'SADAIC', country: 'Argentina' },
  { code: 'ABRAMUS', name: 'ABRAMUS', country: 'Brazil' },
  { code: 'ECAD', name: 'ECAD', country: 'Brazil' },
  { code: 'SAYCO', name: 'SAYCO', country: 'Colombia' },
  { code: 'SAYCE', name: 'SAYCE', country: 'Ecuador' },
  { code: 'APDAYC', name: 'APDAYC', country: 'Peru' },
  { code: 'AGADU', name: 'AGADU', country: 'Uruguay' },
  { code: 'SACVEN', name: 'SACVEN', country: 'Venezuela' },
  { code: 'KODA', name: 'KODA', country: 'Denmark' },
  { code: 'STIM', name: 'STIM', country: 'Sweden' },
  { code: 'TONO', name: 'TONO', country: 'Norway' },
  { code: 'TEOSTO', name: 'Teosto', country: 'Finland' },
  { code: 'AKM', name: 'AKM', country: 'Austria' },
  { code: 'ZAIKS', name: 'ZAIKS', country: 'Poland' },
  { code: 'ARTISJUS', name: 'Artisjus', country: 'Hungary' },
  { code: 'OSA', name: 'OSA', country: 'Czech Republic' },
  { code: 'IMRO', name: 'IMRO', country: 'Ireland' },
  { code: 'SAMRO', name: 'SAMRO', country: 'South Africa' },
  { code: 'COMPASS', name: 'COMPASS', country: 'Singapore' },
  { code: 'IPRS', name: 'IPRS', country: 'India' },
  { code: 'MACP', name: 'MACP', country: 'Malaysia' },
  { code: 'FILSCAP', name: 'FILSCAP', country: 'Philippines' },
  { code: 'CASH', name: 'CASH', country: 'Hong Kong' },
  { code: 'MUST', name: 'MUST', country: 'Taiwan' },
  { code: 'MCSC', name: 'MCSC', country: 'China' },
  { code: 'RAO', name: 'RAO', country: 'Russia' },
  { code: 'ACUM', name: 'ACUM', country: 'Israel' },
  { code: 'MSG', name: 'MSG', country: 'Turkey' }
];

// Validation patterns for work IDs
export const workIdValidation = {
  ISWC: /^T-\d{3}\.\d{3}\.\d{3}-\d$/,
  ASCAP: /^\d{9}$/,
  BMI: /^\d{7,8}$/,
  SESAC: /^\d{10}$/,
  ISRC: /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/
};

// Languages for music
export const musicLanguages = [
  'Instrumental', 'English', 'Spanish', 'Portuguese', 'French', 'German', 
  'Italian', 'Japanese', 'Korean', 'Mandarin', 'Cantonese', 'Arabic', 
  'Hindi', 'Russian', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
  'Polish', 'Turkish', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian',
  'Malay', 'Tagalog', 'Swahili', 'Yoruba', 'Zulu', 'Afrikaans', 'Bengali',
  'Punjabi', 'Tamil', 'Telugu', 'Urdu', 'Persian', 'Romanian', 'Hungarian',
  'Czech', 'Slovak', 'Bulgarian', 'Croatian', 'Serbian', 'Ukrainian',
  'Catalan', 'Basque', 'Galician', 'Welsh', 'Irish', 'Scottish Gaelic'
];

export const usStates = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VI', name: 'Virgin Islands' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'GU', name: 'Guam' },
  { code: 'MP', name: 'Northern Mariana Islands' }
];