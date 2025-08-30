'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Globe, ChevronDown } from 'lucide-react';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Français');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      // Simulation de connexion
      setTimeout(() => {
        if (values.email === 'admin@satismacro.com' && values.password === 'password123') {
          localStorage.setItem('isAuthenticated', 'true');
          toast.success('Connexion réussie!');
          setTimeout(() => router.push('/countries'), 1000);
        } else {
          toast.error('Email ou mot de passe incorrect');
        }
        setIsSubmitting(false);
      }, 1500);
    },
  });

  return (
    <div className="min-h-screen flex bg-white">
      {/* Partie gauche - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex flex-col p-8">
        {/* Header avec logo et sélecteur de langue */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="">
            <Image src="/logo-test.jpg" alt="logo" width={120} height={50} />
            </div>
            
          </div>
          
          {/* Sélecteur de langue */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400">
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{selectedLanguage}</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
              <p className="text-gray-600 mt-2">Connectez vous à votre compte SATIS MACRO</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez votre email"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Mot de passe oublié?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full py-5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              ©2025 SATIS MACRO
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Message de bienvenue */}
      <div className="hidden md:flex w-1/2 bg-green-500 items-center justify-center">
        <div className="text-center text-white px-6">
          <Image
            src="/images.jpg"
            alt="illustration"
            width={500}
            height={600}
            className="mx-auto mb-6 rounded-md"
          />
          <h2 className="text-xl lg:text-2xl font-medium text-gray-800">Bienvenue sur SATIS</h2>
          <p className="text-sm md:text-lg text-gray-700 mt-2">
            Votre nouvel outil de gestion des plaintes et réclamations.
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}