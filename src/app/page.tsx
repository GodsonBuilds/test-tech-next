'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import Image from 'next/image';

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
          // Stocker l'état de connexion
          localStorage.setItem('isAuthenticated', 'true');
          toast.success('Connexion réussie!');
          // Redirection vers la page dashboard après connexion réussie
          setTimeout(() => router.push('/dashboard'), 1000);
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-12"
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
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mot de passe oublié?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
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

      {/* Partie droite - Message de bienvenue avec image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12 relative">
        {/* Overlay sombre pour mieux voir le texte */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="text-center max-w-md z-10 text-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Bienvenue sur SATIS</h2>
            <p className="text-lg opacity-90">
              Votre nouvel outil de gestion des plaintes et réclamations.
            </p>
          </div>
          
          {/* Image de fond stylisée */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Message supplémentaire */}
          <div className="mt-8 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90">
              Gérez efficacement toutes vos réclamations et améliorez la satisfaction client.
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}