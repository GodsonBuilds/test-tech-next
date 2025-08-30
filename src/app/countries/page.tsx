/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import {  LogOut, Search, ArrowUpDown } from 'lucide-react';

export default function CountriesPage() {
  const router = useRouter();
  const { countries, loading, error } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'region' | 'alpha2'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const handleSort = (field: 'name' | 'region' | 'alpha2') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  
  const safeToString = (value: any): string => {
    return value ? value.toString().toLowerCase() : '';
  };

  // Filtrerr et trie les pays
  const filteredAndSortedCountries = countries
    .filter(country => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        safeToString(country.name_fr).includes(searchLower) ||
        safeToString(country.name_en).includes(searchLower) ||
        safeToString(country.alpha2).includes(searchLower) ||
        safeToString(country.alpha3).includes(searchLower) ||
        safeToString(country.region_fr).includes(searchLower) ||
        safeToString(country.region_en).includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';
      
      switch (sortField) {
        case 'name':
          aValue = safeToString(a.name_fr);
          bValue = safeToString(b.name_fr);
          break;
        case 'region':
          aValue = safeToString(a.region_fr);
          bValue = safeToString(b.region_fr);
          break;
        case 'alpha2':
          aValue = safeToString(a.alpha2);
          bValue = safeToString(b.alpha2);
          break;
        default:
          aValue = safeToString(a.name_fr);
          bValue = safeToString(b.name_fr);
      }
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Pas de rendu côté serveur oui
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des pays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">Erreur lors du chargement des pays</p>
          <Button onClick={() => window.location.reload()} variant="default">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap  justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="">
                        <Image src="/logo-test.jpg" alt="logo" width={120} height={50} />
                        </div>
            <h1 className="text-2xl font-bold text-gray-900">SATIS MACRO - Liste des Pays</h1>
          </div>
          
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des pays */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Nom
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drapeau
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('alpha2')}
                  >
                    <div className="flex items-center gap-2">
                      Code
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('region')}
                  >
                    <div className="flex items-center gap-2">
                      Région
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Langue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indicatif
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedCountries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {country.name_fr || 'Non spécifié'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {country.name_en || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl">{country.flag || '🏳️'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{country.alpha2 || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{country.alpha3 || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country.region_fr || 'Non spécifié'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {country.sub_region_fr || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country.lang_fr || 'Non spécifié'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {country.lang_iso || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country.monetary || 'Non spécifié'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {country.symbol ? `${country.symbol} ` : ''}
                        ({country.iso_4217 || 'N/A'})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {country.indicatif ? `+${country.indicatif}` : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedCountries.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun pays trouvé pour "{searchTerm}"</p>
            </div>
          )}

          {filteredAndSortedCountries.length === 0 && !searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun pays disponible</p>
            </div>
          )}
        </div>

        {/* Informations sur les résultats */}
        <div className="mt-4 text-sm text-gray-500">
          {filteredAndSortedCountries.length} pays sur {countries.length}
          {searchTerm && ` pour "${searchTerm}"`}
        </div>
      </div>
    </div>
  );
}