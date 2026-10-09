export type PathFileRaw = {
  country: string;
  season: string;
  league: string;
  filename: string;
};

export type PathFileView = {
  country: string;
  season: string;
  league: string;
  tournament?: string;
  filename: string;
};


// TYPES STORAGE RAW y VIEW

export type PathStorage= {
  directory: {
    country: string;
    season?: string;
    league?: string;
    tournament?: string
  };
  filename: string;
};
