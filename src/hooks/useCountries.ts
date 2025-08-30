import { useState, useEffect } from 'react';

export interface Country {
  id: number;
  flag: string;
  alpha2: string;
  alpha3: string;
  tld: string;
  name: string;
  name_fr: string;
  name_en: string;
  region_fr: string;
  region_en: string;
  sub_region_fr: string;
  sub_region_en: string;
  lang: string;
  lang_fr: string;
  lang_en: string;
  lang_iso: string;
  lang_local: string;
  lang_direction: string;
  indicatif: string;
  phone_length: number;
  monetary: string;
  iso_4217: string;
  symbol: string;
}

interface CountriesResponse {
  resultat: boolean;
  total: number;
  data: Country[];
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://iso.lahrim.fr/countries');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des pays');
        }
        
        const data: CountriesResponse = await response.json();
        
        if (data.resultat && data.data) {
          setCountries(data.data);
        } else {
          throw new Error('Format de données invalide');
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    error
  };
};