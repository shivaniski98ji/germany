// Job data generator - deterministically generates 100,000 jobs for Germany
const TOTAL_JOBS = 100000;

const jobTitles = [
  "Softwareentwickler", "Frontend-Entwickler", "Backend-Entwickler", "Full Stack Entwickler",
  "Datenanalyst", "Data Scientist", "Machine Learning Ingenieur", "DevOps Ingenieur",
  "Cloud Architekt", "Mobile Entwickler", "Android Entwickler", "iOS Entwickler",
  "Produktmanager", "Projektmanager", "Scrum Master", "Business Analyst","Data Entry","Customer Support",
  "UI/UX Designer", "Grafikdesigner", "Brand Designer", "Webdesigner",
  "Marketingmanager", "Digital Marketing Spezialist", "SEO Spezialist", "Content Writer",
  "Texter", "Social Media Manager", "Community Manager", "Growth Hacker",
  "Vertriebsleiter", "Account Manager", "Business Development Manager", "Vertriebsmitarbeiter",
  "Finanzanalyst", "Buchhalter", "Finanzmanager", "Wirtschaftsprüfer",
  "HR Manager", "HR Generalist", "Recruiter", "Talent Acquisition Spezialist",
  "Operations Manager", "Supply Chain Manager", "Logistikkoordinator", "Beschaffungsbeauftragter",
  "Customer Success Manager", "Kundensupport Spezialist", "Technical Support Ingenieur",
  "Netzwerkingenieur", "Cybersecurity Analyst", "Informationssicherheitsbeauftragter",
  "Datenbankadministrator", "Systemadministrator", "IT Manager", "CTO",
  "Rechtsberater", "Compliance Beauftragter", "Risk Manager", "Vertragsmanager",
  "Gesundheitsmanager", "Clinical Research Associate", "Apotheker", "Krankenschwester",
  "Lehrer", "Bildungsberater", "Instructional Designer", "Trainingsmanager",
  "Bauingenieur", "Maschinenbauingenieur", "Elektroingenieur", "Statiker",
  "Architekt", "Stadtplaner", "Umweltberater", "Sicherheitsbeauftragter",
  "Immobilienmakler", "Property Manager", "Facilities Manager", "Construction Manager",
  "Forscher", "Policy Analyst", "Kommunikationsmanager", "Public Relations Officer",
  "Assistent der Geschäftsleitung", "Verwaltungsbeauftragter", "Büroleiter", "Rezeptionist",
  "Video Editor", "Motion Graphics Designer", "Content Strategist", "Brand Manager",
  "Partnerschaftsmanager", "Customer Experience Manager", "Data Engineer", "BI Entwickler",
  "Scrum Master", "Agile Coach", "Release Manager", "Site Reliability Engineer","Work From Home",
  "Penetrationstester", "Cloud Engineer", "Platform Engineer", "API Entwickler",
  "Hoteldirektor", "Restaurantleiter", "Koch", "Sommelier", "Eventmanager",
  "Luftfahrtingenieur", "Pilot", "Flugbegleiter", "Flughafenmanager"
];

// 75+ German companies + global companies with Germany presence
const companies = [
  // German companies
  "Volkswagen AG", "BMW Group", "Mercedes-Benz Group", "Audi AG", "Porsche AG",
  "Siemens AG", "Bosch", "SAP SE", "Deutsche Telekom", "Deutsche Bank",
  "Allianz SE", "Munich Re", "DHL Group", "Deutsche Post", "Lufthansa Group",
  "Adidas", "Puma", "Hugo Boss", "BASF SE", "Bayer AG",
  "Continental AG", "Fresenius", "Henkel AG", "Zalando", "Delivery Hero",
  "E.ON SE", "RWE AG", "EnBW", "Vattenfall", "Uniper",
  "Commerzbank", "DZ Bank", "KfW", "Sparkassen", "Volksbanken",
  "Rewe Group", "EDEKA", "Aldi", "Lidl", "Metro AG",
  "ThyssenKrupp", "Daimler Truck", "MAN SE", "ZF Friedrichshafen", "Kuka",
  "Deutsche Bahn", "Hamburg Port", "MSC", "HHLA", "Fraport",
  "Deutsche Börse", "Europäische Zentralbank", "Bundesbank",
  "Fraunhofer Gesellschaft", "Max-Planck-Gesellschaft", "Helmholtz","Remote Jobs",
  "Charité", "UK Hamburg", "Universitätsklinikum Heidelberg",
  "TU München", "HU Berlin", "RWTH Aachen", "KIT Karlsruhe",
  
  // Global with Germany presence
  "Google Germany", "Amazon", "Microsoft", "Apple", "Meta", "Tesla", "Netflix",
  "IBM", "Oracle", "Cisco", "Dell", "HP", "Salesforce",
  "Accenture", "Deloitte", "PwC", "KPMG", "EY", "McKinsey", "Boston Consulting Group",
  "HSBC", "Citibank", "JPMorgan Chase", "Goldman Sachs",
  "Unilever", "P&G", "Nestle", "Coca-Cola", "PepsiCo",
  "Shell", "BP", "TotalEnergies", "ExxonMobil",
  "GE", "Schneider Electric", "ABB", "Honeywell",
  "Boeing", "Airbus", "Rolls-Royce",
  "Pfizer", "Novartis", "Roche", "GSK", "Johnson & Johnson",
  "Samsung", "LG", "Sony", "Panasonic", "Toshiba",
  "Toyota", "Honda", "Nissan", "Hyundai"
];

const deLocations = [
  // Berlin
  "Berlin-Mitte, Berlin", "Friedrichshain, Berlin", "Kreuzberg, Berlin", "Charlottenburg, Berlin",
  "Prenzlauer Berg, Berlin", "Neukölln, Berlin", "Schöneberg, Berlin", "Tempelhof, Berlin",
  "Steglitz, Berlin", "Spandau, Berlin", "Reinickendorf, Berlin", "Marzahn, Berlin",
  "Lichtenberg, Berlin", "Treptow, Berlin", "Köpenick, Berlin",
  
  // Hamburg
  "Hamburg-Mitte, Hamburg", "Altona, Hamburg", "Eimsbüttel, Hamburg", "Nord, Hamburg",
  "Wandsbek, Hamburg", "Bergedorf, Hamburg", "Harburg, Hamburg",
  
  // Munich
  "München-Mitte, Munich", "Schwabing, Munich", "Giesing, Munich", "Sendling, Munich",
  "Neuhausen, Munich", "Pasing, Munich", "Berg am Laim, Munich", "Bogenhausen, Munich",
  
  // Frankfurt
  "Frankfurt-Innenstadt, Frankfurt", "Sachsenhausen, Frankfurt", "Bockenheim, Frankfurt",
  "Ostend, Frankfurt", "Nordend, Frankfurt", "Westend, Frankfurt",
  
  // Cologne
  "Köln-Altstadt, Cologne", "Ehrenfeld, Cologne", "Lindenthal, Cologne", "Mülheim, Cologne",
  "Porz, Cologne", "Kalk, Cologne",
  
  // Stuttgart
  "Stuttgart-Mitte, Stuttgart", "Bad Cannstatt, Stuttgart", "Vaihingen, Stuttgart",
  "Zuffenhausen, Stuttgart", "Möhringen, Stuttgart",
  
  // Düsseldorf
  "Düsseldorf-Altstadt, Düsseldorf", "Oberkassel, Düsseldorf", "Bilk, Düsseldorf",
  "Flingern, Düsseldorf", "Gerresheim, Düsseldorf",
  
  // Leipzig
  "Leipzig-Mitte, Leipzig", "Connewitz, Leipzig", "Plagwitz, Leipzig", "Reudnitz, Leipzig",
  
  // Dortmund
  "Dortmund-Mitte, Dortmund", "Hörde, Dortmund", "Scharnhorst, Dortmund",
  
  // Essen
  "Essen-Mitte, Essen", "Rüttenscheid, Essen", "Katernberg, Essen",
  
  // Bremen
  "Bremen-Mitte, Bremen", "Findorff, Bremen", "Gröpelingen, Bremen", "Vegesack, Bremen",
  
  // Dresden
  "Dresden-Altstadt, Dresden", "Neustadt, Dresden", "Blasewitz, Dresden",
  
  // Hannover
  "Hannover-Mitte, Hannover", "Nordstadt, Hannover", "List, Hannover", "Laatzen, Hannover",
  
  // Nürnberg
  "Nürnberg-Altstadt, Nürnberg", "Gostenhof, Nürnberg", "Südstadt, Nürnberg",
  
  // Remote
  "Remote — Deutschland", "Remote — Berlin", "Remote — München", "Remote — Frankfurt"
];

const salaryRanges = [
  { display: "€35,000 – €45,000/Jahr", min: 35000, max: 45000 },
  { display: "€45,000 – €55,000/Jahr", min: 45000, max: 55000 },
  { display: "€55,000 – €65,000/Jahr", min: 55000, max: 65000 },
  { display: "€65,000 – €80,000/Jahr", min: 65000, max: 80000 },
  { display: "€80,000 – €95,000/Jahr", min: 80000, max: 95000 },
  { display: "€95,000 – €115,000/Jahr", min: 95000, max: 115000 },
  { display: "€115,000 – €140,000/Jahr", min: 115000, max: 140000 },
  { display: "€140,000 – €180,000/Jahr", min: 140000, max: 180000 },
  { display: "€180,000 – €250,000/Jahr", min: 180000, max: 250000 },
  { display: "€30,000 – €38,000/Jahr", min: 30000, max: 38000 }
];

const jobTypes = ["FULL_TIME", "CONTRACTOR", "PART_TIME", "INTERN", "TEMPORARY"];
const jobTypeDisplay = { 
  "FULL_TIME": "Vollzeit", 
  "CONTRACTOR": "Freiberufler", 
  "PART_TIME": "Teilzeit", 
  "INTERN": "Praktikum", 
  "TEMPORARY": "Befristet" 
};

const experienceLevels = [
  { display: "Einsteiger", schema: "no requirements" },
  { display: "Mid-Level",   schema: "2 years experience" },
  { display: "Senior",schema: "5 years experience" },
  { display: "Lead",        schema: "7 years experience" },
  { display: "Manager",     schema: "5 years experience" },
  { display: "Director",    schema: "8 years experience" },
  { display: "Executive",   schema: "10 years experience" }
];

const industries = [
  "Technologie", "Fintech", "E-Commerce", "Banken & Finanzen", "Automobilindustrie",
  "Immobilien", "Gesundheitswesen", "Bildung", "Beratung", "Luftfahrt",
  "Bauwesen", "Logistik & Versand", "Gastgewerbe", "Einzelhandel", "Medien & Unterhaltung",
  "Erneuerbare Energien", "Telekommunikation", "Rechtswesen", "Öffentlicher Dienst",
  "Chemieindustrie", "Pharmazie", "Maschinenbau", "Elektrotechnik"
];

const jobDescriptions = [
  (title, company, isRemote, location) => `Wir suchen einen talentierten ${title} für das Team bei ${company} in Deutschland. ${isRemote ? "Dies ist eine vollständig remote Position, offen für qualifizierte Kandidaten in ganz Deutschland." : `Diese Position ist basiert in ${location}.`}

Sie sind verantwortlich für qualitativ hochwertige Arbeit, die Geschäftsergebnisse fördert und zum wachsenden Geschäft von ${company} in Deutschland und Europa beiträgt.

Aufgaben:
• Leitung und Durchführung von Kernfunktionen im Bereich ${title.toLowerCase()}
• Zusammenarbeit mit funktionsübergreifenden Teams zur Erreichung strategischer Ziele
• Datenanalyse und Bereitstellung umsetzbarer Erkenntnisse zur Leistungsverbesserung
• Mentoring von Teammitgliedern und Beitrag zum Wissensaustausch
• Sicherstellung von Best Practices in allen Ergebnissen

Anforderungen:
• 3–5 Jahre Erfahrung in einer ähnlichen Position als ${title.toLowerCase()}
• Starke Kommunikations- und Problemlösungsfähigkeiten
• Erfahrung in schnelllebigen globalen Tech-/Geschäftsumgebungen
• Bachelor-Abschluss in einem relevanten Bereich
• Kenntnisse moderner Tools und Plattformen

Wir bieten:
• Wettbewerbsfähiges Gehalt in €
• Krankenversicherung für Sie und Ihre Familie
• 30 Tage Urlaub pro Jahr
• Homeoffice-Zuschuss
• Jährlicher Leistungsbonus
• Weiterbildungsbudget
• Steuerfreie Arbeit in Deutschland`,

  (title, company, isRemote, location) => `${company} sucht einen ${title}! Wir sind ein führendes Unternehmen in Deutschland auf der Suche nach erfahrenen Fachkräften, um unsere Wirkung in ganz Deutschland und Europa zu verstärken.

${isRemote ? "Diese remote-first Position ermöglicht es Ihnen, von überall in Deutschland mit flexiblen Arbeitszeiten zu arbeiten." : `Sie werden in unserem ${location} Büro mit einem dynamischen, ambitionierten Team arbeiten.`}

Über die Rolle:
Als ${title} bei ${company} spielen Sie eine Schlüsselrolle bei der Gestaltung unserer Produkte und Dienstleistungen. Sie arbeiten eng mit der Geschäftsleitung und Kollegen zusammen, um unsere Mission in einer der größten Volkswirtschaften Europas umzusetzen.

Ihre Aufgaben:
• Leitung von ${title.toLowerCase()}-Initiativen von der Planung bis zur Umsetzung
• Aufbau und Pflege von Beziehungen zu wichtigen Stakeholdern
• Berichterstattung über KPIs und Beitrag zur strategischen Planung
• Aktualisierung über Branchentrends in Deutschland und Europa
• Professionelle Repräsentation von ${company}

Ihr Profil:
• 2–6 Jahre nachgewiesene Erfahrung als ${title.toLowerCase()}
• Starke analytische und kommunikative Fähigkeiten
• Teamplayer mit Growth-Mindset
• Relevante Zertifizierung oder Studium bevorzugt

Vergütung & Benefits:
• Wettbewerbsfähiges Gehalt in € • Krankenversicherung • 30 Tage Urlaub • Bonus • Homeoffice-Möglichkeiten • Großartige Work-Life-Balance`,

  (title, company, isRemote, location) => `Werden Sie Teil von ${company} als ${title} und seien Sie Teil eines der aufregendsten Unternehmen Deutschlands!

${isRemote ? "🌐 Remote | Arbeiten Sie von überall in Deutschland" : `📍 ${location}`}

Wir bauen die Zukunft des Geschäfts in Europa und brauchen außergewöhnliche Talente wie Sie. Dies ist eine seltene Gelegenheit, mit einer Weltmarke zu arbeiten und gleichzeitig den hohen Lebensstandard in Deutschland zu genießen.

Die Chance:
Sie übernehmen die ${title}-Rolle in einer entscheidenden Wachstumsphase. Ihre Arbeit wird sich direkt auf Millionen von Kunden in der Region auswirken.

Ihre Aufgaben:
• Umsetzung und Verbesserung von Kernabläufen im ${title.toLowerCase()}-Bereich
• Zusammenarbeit mit Produkt-, Entwicklungs- und Business-Teams
• Überwachung von Kennzahlen und Optimierung der Leistung
• Beitrag zu einer Kultur der Exzellenz und Innovation
• Unterstützung der Geschäftsleitung bei Berichterstattung und Strategie

Ihr Profil:
• 3+ Jahre Erfahrung im ${title.toLowerCase()} oder einem verwandten Bereich
• Souveränität in schnelllebigen globalen Geschäftsökosystemen
• Starke zwischenmenschliche Fähigkeiten und professionelle Arbeitsethik
• Studium in relevantem Fachbereich (Master ist ein Plus)

Benefits bei ${company}:
Attraktives Gehalt | Krankenversicherung | 30 Tage Urlaub | Leistungsbonus | Weiterbildungsbudget | Flexible Arbeitszeiten | Hervorragende Work-Life-Balance in Deutschland`
];

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getJobData(id) {
  const seed = id * 7919;
  const r = (offset = 0) => seededRandom(seed + offset);

  const isRemote = id <= TOTAL_JOBS / 2;

  const companyIndex = Math.floor((id - 1) / Math.ceil(TOTAL_JOBS / companies.length)) % companies.length;

  const titleIndex   = Math.floor(r(1) * jobTitles.length);
  const locationIndex= Math.floor(r(3) * deLocations.length);
  const salaryIndex  = Math.floor(r(4) * salaryRanges.length);
  const jobTypeIndex = Math.floor(r(5) * jobTypes.length);
  const expIndex     = Math.floor(r(6) * experienceLevels.length);
  const industryIndex= Math.floor(r(7) * industries.length);
  const descIndex    = Math.floor(r(8) * jobDescriptions.length);

  const title    = jobTitles[titleIndex];
  const company  = companies[companyIndex];
  const location = isRemote ? "Remote — Deutschland" : deLocations[locationIndex];
  const salary   = salaryRanges[salaryIndex];
  const jobType  = jobTypes[jobTypeIndex];
  const exp      = experienceLevels[expIndex];
  const industry = industries[industryIndex];
  const description = jobDescriptions[descIndex](title, company, isRemote, deLocations[locationIndex]);

  const daysAgo = Math.floor(r(9) * 60);
  const postedDate = new Date();
  postedDate.setDate(postedDate.getDate() - daysAgo);
  const validThrough = new Date(postedDate);
  validThrough.setDate(validThrough.getDate() + 90);

  return {
    id,
    title,
    company,
    location,
    salary: salary.display,
    salaryMin: salary.min,
    salaryMax: salary.max,
    jobType,
    jobTypeDisplay: jobTypeDisplay[jobType],
    experience: exp.display,
    experienceSchema: exp.schema,
    industry,
    isRemote,
    description,
    postedDate: postedDate.toISOString().split('T')[0],
    validThrough: validThrough.toISOString().split('T')[0],
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`
  };
}

function getJobSchema(job) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": `JOB-DE-${String(job.id).padStart(6, '0')}`
    },
    "datePosted": job.postedDate,
    "validThrough": `${job.validThrough}T00:00:00Z`,
    "employmentType": job.jobType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": `https://www.google.com/search?q=${encodeURIComponent(job.company)}`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.isRemote ? "Berlin" : job.location.split(',')[0],
        "addressCountry": "DE"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Germany"
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin,
        "maxValue": job.salaryMax,
        "unitText": "YEAR"
      }
    },
    "experienceRequirements": {
      "@type": "OccupationalExperienceRequirements",
      "monthsOfExperience": job.experienceSchema === "no requirements" ? 0
        : parseInt(job.experienceSchema) * 12
    },
    "industry": job.industry,
    "url": `/jobs/${job.id}`,
    "directApply": true
  };

  if (job.isRemote) {
    schema.jobLocationType = "TELECOMMUTE";
  }

  return schema;
}

module.exports = { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, deLocations, industries };
