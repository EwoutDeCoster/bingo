export interface BingoItem {
  id: string;
  text: string;
  active: boolean;
}

export const defaultBingoItems: BingoItem[] = [
  { id: '1', text: 'Iemand spreekt gebrekkig Frans/Engels/Spaans', active: true },
  { id: '2', text: 'Iemand maakt een stomme grap', active: true },
  { id: '3', text: 'Verkeerd gereden of gemiste afslag', active: true },
  { id: '4', text: 'Iemand klaagt over de hitte/kou/regen', active: true },
  { id: '5', text: 'Te laat vertrokken', active: true },
  { id: '6', text: 'Zonnebrandcrème vergeten (verbrand!)', active: true },
  { id: '7', text: 'Iemand raakt zonnebril of sleutels kwijt', active: true },
  { id: '8', text: 'Klagen over de prijs van een drankje/eten', active: true },
  { id: '9', text: 'Foto maken van het eten of de menukaart', active: true },
  { id: '10', text: 'Lokale delicatesse proberen en vies vinden', active: true },
  { id: '11', text: 'Iemand valt in slaap in de auto/trein/vliegtuig', active: true },
  { id: '12', text: 'Succesvol een mug of vlieg doodgemaakt', active: true },
  { id: '13', text: 'Taalverwarring bij het bestellen', active: true },
  { id: '14', text: 'Veel te veel bagage meegenomen', active: true },
  { id: '15', text: 'Iemand vraagt wanhopig om de wifi-code', active: true },
  { id: '16', text: 'Staan in de file of vertraging', active: true },
  { id: '17', text: 'Plaatselijke supermarkt verkennen als attractie', active: true },
  { id: '18', text: 'Zwemmen in ijskoud water', active: true },
  { id: '19', text: 'Iemand snurkt luidruchtig', active: true },
  { id: '20', text: 'Elkaar even kwijtgeraakt in een stad', active: true },
  { id: '21', text: 'Slechte woordspeling gemaakt door de chauffeur', active: true },
  { id: '22', text: 'Iets valt in het zand of in het zwembad', active: true },
  { id: '23', text: 'Alcoholisch drankje voor 12:00 uur \'s middags', active: true },
  { id: '24', text: 'Onverwachte regenbui op een zonnige bestemming', active: true },
  { id: '25', text: 'Een overduidelijke "tourist trap" bezocht', active: true }
];
