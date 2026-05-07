import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AuthScreen from './components/AuthScreen';
import { useAuth } from './hooks/useAuth';
import { 
  Compass, EyeOff, ChevronRight, ArrowLeft,
  Coffee, TreePine, Theater, Home, Sparkles, Star,
  HelpCircle, Moon, Sun, CheckCircle, Ticket, 
  Archive, Plus, Trash2, Delete, Pencil, ChevronDown, AlertCircle,
  Plane, Palette, Calendar, Heart, Dices
} from 'lucide-react';

// --- LES 10 THÈMES DE TON FICHIER MARKDOWN ---
const THEMES = [
  { id: 'gastro', name: 'Gastronomie', icon: Coffee, colorLight: 'text-amber-600', colorDark: 'text-amber-300', cardLight: 'bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:shadow-amber-500/20', cardDark: 'bg-amber-950/20 border-amber-900/50 hover:border-amber-500/50 hover:shadow-amber-900/40' },
  { id: 'nature', name: 'Nature', icon: TreePine, colorLight: 'text-green-600', colorDark: 'text-green-300', cardLight: 'bg-green-50/50 border-green-200 hover:border-green-400 hover:shadow-green-500/20', cardDark: 'bg-green-950/20 border-green-900/50 hover:border-green-500/50 hover:shadow-green-900/40' },
  { id: 'culture', name: 'Culture', icon: Theater, colorLight: 'text-purple-600', colorDark: 'text-purple-300', cardLight: 'bg-purple-50/50 border-purple-200 hover:border-purple-400 hover:shadow-purple-500/20', cardDark: 'bg-purple-950/20 border-purple-900/50 hover:border-purple-500/50 hover:shadow-purple-900/40' },
  { id: 'aventure', name: 'Aventure', icon: Compass, colorLight: 'text-red-600', colorDark: 'text-red-300', cardLight: 'bg-red-50/50 border-red-200 hover:border-red-400 hover:shadow-red-500/20', cardDark: 'bg-red-950/20 border-red-900/50 hover:border-red-500/50 hover:shadow-red-900/40' },
  { id: 'cocooning', name: 'Cocooning', icon: Home, colorLight: 'text-orange-600', colorDark: 'text-orange-300', cardLight: 'bg-orange-50/50 border-orange-200 hover:border-orange-400 hover:shadow-orange-500/20', cardDark: 'bg-orange-950/20 border-orange-900/50 hover:border-orange-500/50 hover:shadow-orange-900/40' },
  { id: 'voyages', name: 'Voyages', icon: Plane, colorLight: 'text-cyan-600', colorDark: 'text-cyan-300', cardLight: 'bg-cyan-50/50 border-cyan-200 hover:border-cyan-400 hover:shadow-cyan-500/20', cardDark: 'bg-cyan-950/20 border-cyan-900/50 hover:border-cyan-500/50 hover:shadow-cyan-900/40' },
  { id: 'soirees', name: 'Soirées', icon: Moon, colorLight: 'text-indigo-600', colorDark: 'text-indigo-300', cardLight: 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-500/20', cardDark: 'bg-indigo-950/20 border-indigo-900/50 hover:border-indigo-500/50 hover:shadow-indigo-900/40' },
  { id: 'creativite', name: 'Créativité', icon: Palette, colorLight: 'text-pink-600', colorDark: 'text-pink-300', cardLight: 'bg-pink-50/50 border-pink-200 hover:border-pink-400 hover:shadow-pink-500/20', cardDark: 'bg-pink-950/20 border-pink-900/50 hover:border-pink-500/50 hover:shadow-pink-900/40' },
  { id: 'bienetre', name: 'Bien-être', icon: Sparkles, colorLight: 'text-teal-600', colorDark: 'text-teal-300', cardLight: 'bg-teal-50/50 border-teal-200 hover:border-teal-400 hover:shadow-teal-500/20', cardDark: 'bg-teal-950/20 border-teal-900/50 hover:border-teal-500/50 hover:shadow-teal-900/40' },
  { id: 'saisonnier', name: 'Saisonnier', icon: Calendar, colorLight: 'text-rose-600', colorDark: 'text-rose-300', cardLight: 'bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-rose-500/20', cardDark: 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500/50 hover:shadow-rose-900/40' },
  { id: 'calin', name: 'Câlins & Frissons', icon: Heart, colorLight: 'text-rose-600', colorDark: 'text-rose-300', cardLight: 'bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-rose-500/20', cardDark: 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500/50 hover:shadow-rose-900/40' },
  { id: 'jeux', name: 'Jeux', icon: Dices, colorLight: 'text-violet-600', colorDark: 'text-violet-300', cardLight: 'bg-violet-50/50 border-violet-200 hover:border-violet-400 hover:shadow-violet-500/20', cardDark: 'bg-violet-950/20 border-violet-900/50 hover:border-violet-500/50 hover:shadow-violet-900/40' }
];

// --- LES 365 IDÉES INTÉGRÉES ---
const INITIAL_ACTIVITIES = [
  { id: 1, themeId: 'gastro', title: 'Dîner dans un restaurant gastronomique étoilé', desc: 'Réservez des mois à l\'avance, habillez-vous chic', funny: '' },
  { id: 2, themeId: 'gastro', title: 'Brunch tardif dans un café cosy', desc: 'Journaux, croissants et pas de réveil', funny: '' },
  { id: 3, themeId: 'gastro', title: 'Picnic au coucher du soleil', desc: 'Planche charcuterie, vin rosé, plaid', funny: '' },
  { id: 4, themeId: 'gastro', title: 'Cuisiner un plat d\'un pays qu\'on veut visiter', desc: 'Déguisez-vous en chef du pays 👨‍🍳', funny: '' },
  { id: 5, themeId: 'gastro', title: 'Dégustation de vins dans une cave', desc: 'Prévoir un taxi pour le retour 🍷', funny: '' },
  { id: 6, themeId: 'gastro', title: 'Atelier de fabrication de chocolats', desc: 'On repart avec ses créations', funny: '' },
  { id: 7, themeId: 'gastro', title: 'Dîner suspendu (table dans les arbres)', desc: 'Existe dans plusieurs villes de France', funny: '' },
  { id: 8, themeId: 'gastro', title: 'Cours de cuisine japonaise (sushis, ramen)', desc: 'Se filmer en train de rater les makis 😂', funny: '' },
  { id: 9, themeId: 'gastro', title: 'Soirée fondue ou raclette maison', desc: 'Lumières tamisées, bougies', funny: '' },
  { id: 10, themeId: 'gastro', title: 'Marché de producteurs locaux le matin', desc: 'Cuisiner ensemble ce qu\'on y trouve', funny: '' },
  { id: 11, themeId: 'gastro', title: 'Restaurant les pieds dans l\'eau', desc: 'Bord de Loire côté Angers, bord de mer', funny: '' },
  { id: 12, themeId: 'gastro', title: 'Blind taste test à la maison', desc: 'Bander les yeux, faire deviner les saveurs', funny: '' },
  { id: 13, themeId: 'gastro', title: 'Cours de pâtisserie en couple', desc: 'Croissants maison, c\'est une fierté', funny: '' },
  { id: 14, themeId: 'gastro', title: 'Soirée tapas espagnoles + sangria', desc: 'Musique flamenco en fond', funny: '' },
  { id: 15, themeId: 'gastro', title: 'Dîner dans le noir total', desc: 'Restaurant Dans le Noir®', funny: '' },
  { id: 16, themeId: 'gastro', title: 'Plateau de fromages affinés + dégustation', desc: 'Le fromager vous guide', funny: '' },
  { id: 17, themeId: 'gastro', title: 'Cook-off : chacun prépare un plat surprise', desc: 'L\'autre doit deviner les ingrédients', funny: '' },
  { id: 18, themeId: 'gastro', title: 'Dîner sur une péniche ou bateau', desc: 'Au fil de l\'eau 🛶', funny: '' },
  { id: 19, themeId: 'gastro', title: 'Atelier cocktails avec un barman', desc: 'Repartez avec vos recettes', funny: '' },
  { id: 20, themeId: 'gastro', title: 'Déjeuner en terrasse en plein hiver', desc: 'Plaids + vin chaud = duo gagnant', funny: '' },
  { id: 21, themeId: 'gastro', title: 'Soirée sushis maison + film japonais', desc: 'Ambiance totale', funny: '' },
  { id: 22, themeId: 'gastro', title: 'Dîner à la bougie dans votre salon', desc: 'Vous jouez le jeu comme si c\'était un vrai resto', funny: '' },
  { id: 23, themeId: 'gastro', title: 'Atelier boulangerie (pain, brioche)', desc: 'L\'odeur du pain chaud le matin 🥖', funny: '' },
  { id: 24, themeId: 'gastro', title: 'Explorer tous les restaurants d\'une rue', desc: 'Un verre ou une entrée par établissement', funny: '' },
  { id: 25, themeId: 'gastro', title: 'Soirée raclette sur un rooftop', desc: 'Brancher un poêle à fondue portable', funny: '' },
  { id: 26, themeId: 'gastro', title: 'Dégustation de bières artisanales', desc: 'Brewery tour dans votre région', funny: '' },
  { id: 27, themeId: 'gastro', title: 'Préparer un plateau petit-déj surprise au lit', desc: 'Fleurs, jus frais, croissants chauds 🌸', funny: '' },
  { id: 28, themeId: 'gastro', title: 'Apéro au sommet d\'une colline', desc: 'Champagne + vue panoramique', funny: '' },
  { id: 29, themeId: 'gastro', title: 'Cuisiner ensemble une recette de grand-mère', desc: 'Retrouver les saveurs d\'enfance', funny: '' },
  { id: 30, themeId: 'gastro', title: 'Dîner thaï + soirée massage maison', desc: 'Cohérence totale 🇹🇭', funny: '' },
  { id: 31, themeId: 'gastro', title: 'Fondue au chocolat avec fruits exotiques', desc: 'Mangue, framboise, fraise...', funny: '' },
  { id: 32, themeId: 'gastro', title: 'Brunch en pleine forêt', desc: 'Thermos + paniers organisés comme une expé', funny: '' },
  { id: 33, themeId: 'gastro', title: 'Soirée huîtres + muscadet', desc: 'La combinaison parfaite 🦪', funny: '' },
  { id: 34, themeId: 'gastro', title: 'Street food tour dans une grande ville', desc: 'Chaque stand = un pays différent', funny: '' },
  { id: 35, themeId: 'gastro', title: 'Dîner chez l\'habitant (Airbnb Experiences)', desc: 'Immersion culinaire authentique', funny: '' },
  
  { id: 36, themeId: 'nature', title: 'Randonnée avec pique-nique au sommet', desc: 'Belvédère surprise', funny: '' },
  { id: 37, themeId: 'nature', title: 'Observer le lever du soleil ensemble', desc: 'Se lever à 5h, ça vaut le coup 🌅', funny: '' },
  { id: 38, themeId: 'nature', title: 'Balade en vélo dans les vignes', desc: 'Idéal au printemps ou en automne', funny: '' },
  { id: 39, themeId: 'nature', title: 'Pêche au bord d\'une rivière', desc: 'Même sans attraper quoi que ce soit', funny: '' },
  { id: 40, themeId: 'nature', title: 'Nuit sous les étoiles (bivouac)', desc: 'Apprendre à reconnaître les constellations 🌌', funny: '' },
  { id: 41, themeId: 'nature', title: 'Canoë-kayak sur un cours d\'eau', desc: 'Escapade half-day', funny: '' },
  { id: 42, themeId: 'nature', title: 'Bain de forêt (Shinrin-Yoku)', desc: 'Marche lente, pleine conscience', funny: '' },
  { id: 43, themeId: 'nature', title: 'Chercher des champignons en automne', desc: 'Demandez conseil à un expert 🍄', funny: '' },
  { id: 44, themeId: 'nature', title: 'Jardinage ensemble dans votre espace vert', desc: 'Planter quelque chose qui poussera avec vous', funny: '' },
  { id: 45, themeId: 'nature', title: 'Balade à cheval', desc: 'Cavalier ou non, c\'est magique', funny: '' },
  { id: 46, themeId: 'nature', title: 'Observer une éclipse ou pluie d\'étoiles', desc: 'Consulter les dates astronomiques 🌠', funny: '' },
  { id: 47, themeId: 'nature', title: 'Grimper aux arbres dans un accrobranche', desc: 'On redevient enfant', funny: '' },
  { id: 48, themeId: 'nature', title: 'Nuit en cabane dans les arbres', desc: 'Connexion totale avec la nature', funny: '' },
  { id: 49, themeId: 'nature', title: 'Promenade en barque sur un étang', desc: 'Coucher de soleil en bonus', funny: '' },
  { id: 50, themeId: 'nature', title: 'Cueillette de fraises / framboises', desc: 'À la ferme, en été ❤️', funny: '' },
  { id: 51, themeId: 'nature', title: 'Explorer une grotte ou caverne', desc: 'Aventure spéléo douce', funny: '' },
  { id: 52, themeId: 'nature', title: 'Balade nocturne au clair de lune', desc: 'Lampe frontale + chocolat chaud', funny: '' },
  { id: 53, themeId: 'nature', title: 'Visite d\'un jardin botanique', desc: 'Découvrir la flore du monde 🌺', funny: '' },
  { id: 54, themeId: 'nature', title: 'Glamping dans la nature', desc: 'Tente équipée avec literie moelleuse', funny: '' },
  { id: 55, themeId: 'nature', title: 'Observation des oiseaux (birdwatching)', desc: 'Avec jumelles et guide', funny: '' },
  { id: 56, themeId: 'nature', title: 'Baignade dans une rivière sauvage', desc: 'Spots secrets à partager', funny: '' },
  { id: 57, themeId: 'nature', title: 'Faire des photos au golden hour', desc: 'Courir chercher la meilleure lumière', funny: '' },
  { id: 58, themeId: 'nature', title: 'Trail running à deux', desc: 'Même rythme sinon compétition 😄', funny: '' },
  { id: 59, themeId: 'nature', title: 'Longer la côte à pied', desc: 'Week-end coup de vent en bord de mer', funny: '' },
  { id: 60, themeId: 'nature', title: 'Voir les baleines ou dauphins en mer', desc: 'Sortie en bateau mémorable', funny: '' },
  { id: 61, themeId: 'nature', title: 'Sortie en kayak de mer', desc: 'Calanques, côtes bretonnes...', funny: '' },
  { id: 62, themeId: 'nature', title: 'Escalade outdoor sur falaise naturelle', desc: 'Assurer la sécurité de l\'autre', funny: '' },
  { id: 63, themeId: 'nature', title: 'Sortie florale au printemps', desc: 'Marcher entre les champs de lavande ou cerisiers 💜', funny: '' },
  { id: 64, themeId: 'nature', title: 'Nuit dans un igloo', desc: 'Escapade hivernale extrême', funny: '' },
  { id: 65, themeId: 'nature', title: 'Cueillette de lavande ou tournesols', desc: 'Séance photo garantie', funny: '' },
  { id: 66, themeId: 'nature', title: 'Balade le long d\'un canal à vélo', desc: 'Tranquille et bucolique', funny: '' },
  { id: 67, themeId: 'nature', title: 'Visite d\'un parc national', desc: 'S\'émerveiller devant la faune sauvage', funny: '' },
  { id: 68, themeId: 'nature', title: 'Soirée à observer la Lune avec télescope', desc: 'Endroit sans pollution lumineuse', funny: '' },
  { id: 69, themeId: 'nature', title: 'Promenade en forêt sous la neige', desc: 'Silence absolu, c\'est magique ❄️', funny: '' },
  { id: 70, themeId: 'nature', title: 'Visite d\'un refuge d\'animaux', desc: 'Câlins garantis 🐾', funny: '' },
  { id: 71, themeId: 'nature', title: 'Marché aux fleurs + composition', desc: 'Créer un arrangement floral ensemble', funny: '' },
  { id: 72, themeId: 'nature', title: 'Planter un arbre ensemble', desc: 'Un symbole qui dure', funny: '' },
  { id: 73, themeId: 'nature', title: 'Sortie en quad dans la campagne', desc: 'Sensations fortes et boue', funny: '' },
  { id: 74, themeId: 'nature', title: 'Faire un cerf-volant ensemble', desc: 'Sur une plage ou grande prairie', funny: '' },
  { id: 75, themeId: 'nature', title: 'Observer une aurore boréale', desc: 'Le voyage ultime en hiver 🌌', funny: '' },
  { id: 76, themeId: 'nature', title: 'Nuit en yourte', desc: 'Dépaysement total', funny: '' },
  { id: 77, themeId: 'nature', title: 'Chercher des fossiles sur une plage', desc: 'Un peu d\'archéologie amateur', funny: '' },
  { id: 78, themeId: 'nature', title: 'Visite d\'un phare', desc: 'Monter tout en haut pour la vue', funny: '' },
  { id: 79, themeId: 'nature', title: 'Faire une photo au même endroit chaque saison', desc: 'Projet photo sur une année', funny: '' },
  { id: 80, themeId: 'nature', title: 'Dormir sous une pergola étoilée', desc: 'Matelas gonflable + couettes dans le jardin 🌙', funny: '' },

  { id: 81, themeId: 'culture', title: 'Vernissage dans une galerie d\'art', desc: 'Champagne et discussions profondes', funny: '' },
  { id: 82, themeId: 'culture', title: 'Opéra ou ballet', desc: 'S\'habiller très chic', funny: '' },
  { id: 83, themeId: 'culture', title: 'Concert de jazz dans un club intimiste', desc: 'Ambiance tamisée 🎷', funny: '' },
  { id: 84, themeId: 'culture', title: 'Visite d\'un musée en nocturne', desc: 'Nuit Blanche ou heures décalées', funny: '' },
  { id: 85, themeId: 'culture', title: 'Cinéma en plein air', desc: 'Apporter plaids et pop-corn maison 🎬', funny: '' },
  { id: 86, themeId: 'culture', title: 'Spectacle d\'improvisation théâtrale', desc: 'On rit beaucoup', funny: '' },
  { id: 87, themeId: 'culture', title: 'Atelier poterie ensemble', desc: 'Ghost pottery style 🏺', funny: '' },
  { id: 88, themeId: 'culture', title: 'Lire le même livre puis en débattre', desc: 'Club de lecture à deux', funny: '' },
  { id: 89, themeId: 'culture', title: 'Voir un film dans une langue étrangère', desc: 'Sans sous-titres pour les courageux', funny: '' },
  { id: 90, themeId: 'culture', title: 'Visite d\'un château majestueux', desc: 'Se prendre pour des rois le temps d\'une journée', funny: '' },
  { id: 91, themeId: 'culture', title: 'Assister à une conférence TED ou scientifique', desc: 'Sujet qui vous passionne tous les deux', funny: '' },
  { id: 92, themeId: 'culture', title: 'Concert acoustique dans un lieu atypique', desc: 'Acoustique renversante', funny: '' },
  { id: 93, themeId: 'culture', title: 'Atelier calligraphie', desc: 'Écrire un mot doux à l\'autre', funny: '' },
  { id: 94, themeId: 'culture', title: 'Visite d\'un atelier d\'artiste', desc: 'Découvrir l\'envers du décor', funny: '' },
  { id: 95, themeId: 'culture', title: 'Soirée jeu de piste dans un musée', desc: 'Escape game culturel', funny: '' },
  { id: 96, themeId: 'culture', title: 'Assister à un match de sport en direct', desc: 'Ambiance stade', funny: '' },
  { id: 97, themeId: 'culture', title: 'Festival de cinéma ou de musique', desc: 'Bain de foule et culture', funny: '' },
  { id: 98, themeId: 'culture', title: 'Cabaret ou spectacle de variétés', desc: 'Plumes, paillettes et magie', funny: '' },
  { id: 99, themeId: 'culture', title: 'Cours de photographie en duo', desc: 'Vous vous photographiez mutuellement', funny: '' },
  { id: 100, themeId: 'culture', title: 'Escape game thématique', desc: 'Romance, aventure, mystère', funny: '' },
  { id: 101, themeId: 'culture', title: 'Soirée slam poetry', desc: 'Atelier d\'écriture ou spectacle', funny: '' },
  { id: 102, themeId: 'culture', title: 'Visite guidée nocturne d\'une ville', desc: 'Découvrir les secrets historiques 🏛️', funny: '' },
  { id: 103, themeId: 'culture', title: 'Assister à une répétition générale', desc: 'Souvent gratuit ou à prix réduit', funny: '' },
  { id: 104, themeId: 'culture', title: 'Musée des illusions', desc: 'Rires garantis et photos absurdes 🤣', funny: '' },
  { id: 105, themeId: 'culture', title: 'Karaoké en duo dans un box privé', desc: 'Personne ne vous entend chanter faux 🎤', funny: '' },
  { id: 106, themeId: 'culture', title: 'Créer un album photo de vos souvenirs', desc: 'Imprimé physique à offrir', funny: '' },
  { id: 107, themeId: 'culture', title: 'Cours de danse (salsa, tango, swing)', desc: 'On apprend à se synchroniser', funny: '' },
  { id: 108, themeId: 'culture', title: 'Expo immersive lumineuse', desc: 'Type Atelier des Lumières', funny: '' },
  { id: 109, themeId: 'culture', title: 'Concevoir une playlist commune', desc: '"Notre playlist de l\'année"', funny: '' },
  { id: 110, themeId: 'culture', title: 'Ciné-club à la maison sur un thème', desc: 'Tous les films d\'un réalisateur', funny: '' },
  { id: 111, themeId: 'culture', title: 'Visite d\'une ville sous la forme d\'une chasse au trésor', desc: 'Créer le parcours pour l\'autre', funny: '' },
  { id: 112, themeId: 'culture', title: 'Assister à un feu d\'artifice', desc: 'Trouver le meilleur spot 🎆', funny: '' },
  { id: 113, themeId: 'culture', title: 'Initiation au street art', desc: 'Avec un artiste local', funny: '' },
  { id: 114, themeId: 'culture', title: 'Voir une comédie musicale', desc: 'Grand spectacle garanti', funny: '' },
  { id: 115, themeId: 'culture', title: 'Peindre ensemble une toile', desc: 'Sans se juger 🎨', funny: '' },
  { id: 116, themeId: 'culture', title: 'Atelier gravure ou linogravure', desc: 'Technique méconnue et très zen', funny: '' },
  { id: 117, themeId: 'culture', title: 'Visite d\'une bibliothèque patrimoniale', desc: 'Sentir l\'odeur des vieux livres', funny: '' },
  { id: 118, themeId: 'culture', title: 'Atelier aquarelle dans un parc', desc: 'En plein air si possible', funny: '' },
  { id: 119, themeId: 'culture', title: 'Réaliser un court-métrage ensemble', desc: 'Histoire d\'amour filmée en une journée 🎥', funny: '' },
  { id: 120, themeId: 'culture', title: 'Créer un livre illustré de votre relation', desc: 'Souvenirs + dessins + tickets', funny: '' },

  { id: 121, themeId: 'aventure', title: 'Saut en parachute en tandem', desc: 'Le grand frisson ❤️', funny: '' },
  { id: 122, themeId: 'aventure', title: 'Parapente biplace', desc: 'Vue imprenable, adrénaline douce', funny: '' },
  { id: 123, themeId: 'aventure', title: 'Karting en couple', desc: 'Le perdant offre le dîner 🏎️', funny: '' },
  { id: 124, themeId: 'aventure', title: 'Via ferrata', desc: 'Accroché à la paroi montagneuse', funny: '' },
  { id: 125, themeId: 'aventure', title: 'Stand up paddle sur un lac', desc: 'Calme et propice aux chutes rigolotes', funny: '' },
  { id: 126, themeId: 'aventure', title: 'Tyrolienne géante', desc: 'Cri + rires garantis', funny: '' },
  { id: 127, themeId: 'aventure', title: 'Ski ou snowboard en station', desc: 'Après-ski au coin du feu ⛷️', funny: '' },
  { id: 128, themeId: 'aventure', title: 'Plongée sous-marine initiation', desc: 'Découvrir un nouveau monde de silence', funny: '' },
  { id: 129, themeId: 'aventure', title: 'Surf ensemble', desc: 'Prendre la même vague 🌊', funny: '' },
  { id: 130, themeId: 'aventure', title: 'Tennis ou padel', desc: 'Suivi d\'un apéro terrasse', funny: '' },
  { id: 131, themeId: 'aventure', title: 'Cours de self-défense en couple', desc: 'Pratique et original', funny: '' },
  { id: 132, themeId: 'aventure', title: 'Yoga en plein air', desc: 'Au lever du soleil dans un parc', funny: '' },
  { id: 133, themeId: 'aventure', title: 'Randonnée à raquettes en montagne', desc: 'Silence + blanc total ❄️', funny: '' },
  { id: 134, themeId: 'aventure', title: 'Bowling + bières artisanales', desc: 'Soirée classique mais efficace', funny: '' },
  { id: 135, themeId: 'aventure', title: 'Mini-golf décoré', desc: 'Romantique en soirée sous les lumières', funny: '' },
  { id: 136, themeId: 'aventure', title: 'Aquabike ou cours en piscine', desc: 'Rigolo et très sportif', funny: '' },
  { id: 137, themeId: 'aventure', title: 'Vélo de route itinéraire surprise', desc: 'Destination cachée jusqu\'au bout', funny: '' },
  { id: 138, themeId: 'aventure', title: 'Ziplining côte à côte', desc: 'Main dans la main si possible', funny: '' },
  { id: 139, themeId: 'aventure', title: 'Bungee jumping (Saut à l\'élastique)', desc: 'Pour les plus courageux 🪂', funny: '' },
  { id: 140, themeId: 'aventure', title: 'Accrobranche parcours aventure extrême', desc: 'Tester ses limites physiques', funny: '' },
  { id: 141, themeId: 'aventure', title: 'Pilotage d\'un bolide sur circuit', desc: 'Sensations fortes au volant', funny: '' },
  { id: 142, themeId: 'aventure', title: 'Cours de boxe thaï en duo', desc: 'Défoulement total garanti', funny: '' },
  { id: 143, themeId: 'aventure', title: 'Roller en couple dans un parc', desc: 'Comme dans les années 80 🛼', funny: '' },
  { id: 144, themeId: 'aventure', title: 'Escalade en salle de bloc', desc: 'Grimper ensemble, s\'encourager', funny: '' },
  { id: 145, themeId: 'aventure', title: 'Initiation à la voile ou catamaran', desc: 'Apprendre à barrer à deux ⛵', funny: '' },
  { id: 146, themeId: 'aventure', title: 'Trail nocturne en forêt', desc: 'Lampes frontales + adrénaline', funny: '' },
  { id: 147, themeId: 'aventure', title: 'Tir à l\'arc', desc: 'Concentration et mini-compétition', funny: '' },
  { id: 148, themeId: 'aventure', title: 'Initiation au golf', desc: 'Même sans y connaître rien, c\'est fun', funny: '' },
  { id: 149, themeId: 'aventure', title: 'Plongée en apnée au large', desc: 'Observation de la faune marine', funny: '' },
  { id: 150, themeId: 'aventure', title: 'Match de tennis de table', desc: 'On se connaît vraiment au ping-pong 🏓', funny: '' },
  { id: 151, themeId: 'aventure', title: 'CrossFit ou Bootcamp à deux', desc: 'Transpirer ensemble pour se dépasser', funny: '' },
  { id: 152, themeId: 'aventure', title: 'Ice skating (patinoire)', desc: 'Tenir la main = excuse parfaite ⛸️', funny: '' },
  { id: 153, themeId: 'aventure', title: 'Randonnée avec bivouac intense', desc: 'Sac à dos lourd et dépassement de soi', funny: '' },
  { id: 154, themeId: 'aventure', title: 'Accrobranche de nuit', desc: 'Forêt éclairée à la frontale', funny: '' },
  { id: 155, themeId: 'aventure', title: 'Initiation au char à voile / cerf-volant traction', desc: 'Se laisser tirer par le vent', funny: '' },

  { id: 156, themeId: 'cocooning', title: 'Soirée spa à la maison', desc: 'Bain aux huiles essentielles, masques, bougies 🕯️', funny: '' },
  { id: 157, themeId: 'cocooning', title: 'Marathon de films d\'une saga', desc: 'Star Wars, Marvel, Harry Potter...', funny: '' },
  { id: 158, themeId: 'cocooning', title: 'Fabriquer sa propre bougie parfumée', desc: 'DIY cocooning parfait', funny: '' },
  { id: 159, themeId: 'cocooning', title: 'Jeux de société toute la nuit', desc: 'Boire un shot (ou manger un bonbon) à chaque défaite', funny: '' },
  { id: 160, themeId: 'cocooning', title: 'Lire à deux à voix haute', desc: 'Roman, nouvelles, poésie...', funny: '' },
  { id: 161, themeId: 'cocooning', title: 'Massage mutuel à la bougie', desc: 'Huile chauffante, musique douce', funny: '' },
  { id: 162, themeId: 'cocooning', title: 'Construire un fort de couvertures', desc: 'Films dedans, popcorn obligatoire', funny: '' },
  { id: 163, themeId: 'cocooning', title: 'Soirée karaoké à la maison', desc: 'YouTube + micro Bluetooth 🎤', funny: '' },
  { id: 164, themeId: 'cocooning', title: 'Créer un journal de bord de couple', desc: 'Écrire ensemble, dessiner', funny: '' },
  { id: 165, themeId: 'cocooning', title: 'Regarder des photos de notre enfance', desc: 'Et se moquer tendrement', funny: '' },
  { id: 166, themeId: 'cocooning', title: 'Soirée puzzle géant', desc: '1000 pièces, musique douce', funny: '' },
  { id: 167, themeId: 'cocooning', title: 'Apprendre une langue ensemble', desc: '30 min sur le canapé', funny: '' },
  { id: 168, themeId: 'cocooning', title: 'Inventer un jeu de société à deux', desc: 'Avec des règles maison absurdes', funny: '' },
  { id: 169, themeId: 'cocooning', title: 'Soirée popcorn + films d\'horreur', desc: 'Se serrer l\'un contre l\'autre 😱', funny: '' },
  { id: 170, themeId: 'cocooning', title: 'Jouer à des jeux vidéo en coop', desc: 'Mario, It Takes Two, Overcooked', funny: '' },
  { id: 171, themeId: 'cocooning', title: 'Redécorer une pièce ensemble', desc: 'Changer les meubles de place', funny: '' },
  { id: 172, themeId: 'cocooning', title: 'Créer une playlist "film de notre vie"', desc: 'Musiques qui nous définissent', funny: '' },
  { id: 173, themeId: 'cocooning', title: 'Méditation guidée ensemble', desc: 'Allongés dans le noir absolu', funny: '' },
  { id: 174, themeId: 'cocooning', title: 'Inventer un cocktail signature', desc: 'Le nommer d\'un surnom entre vous', funny: '' },
  { id: 175, themeId: 'cocooning', title: 'Faire du slime ou de la pâte à modeler', desc: 'Oui, même pour adultes 😂', funny: '' },
  { id: 176, themeId: 'cocooning', title: 'Soirée rétro : vieux films en noir et blanc', desc: 'Ambiance vintage 🎞️', funny: '' },
  { id: 177, themeId: 'cocooning', title: 'Faire une bucket list de couple', desc: 'Lister 100 choses à faire dans sa vie', funny: '' },
  { id: 178, themeId: 'cocooning', title: 'Commencer un potager d\'intérieur', desc: 'Herbes aromatiques dans la cuisine', funny: '' },
  { id: 179, themeId: 'cocooning', title: 'Soirée origami au chaud', desc: 'Plier du papier en écoutant la pluie', funny: '' },
  { id: 180, themeId: 'cocooning', title: 'Créer un carnet de citations', desc: 'Noter les phrases drôles de l\'autre', funny: '' },
  { id: 181, themeId: 'cocooning', title: 'Inventer une recette de pizza maison', desc: '"La pizza de l\'amour" 🍕', funny: '' },
  { id: 182, themeId: 'cocooning', title: 'Regarder un lever de soleil en live web', desc: 'D\'un autre pays, en pyjama', funny: '' },
  { id: 183, themeId: 'cocooning', title: 'Faire du yoga yin dans le salon', desc: 'Poses douces tenues longtemps', funny: '' },
  { id: 184, themeId: 'cocooning', title: 'S\'écrire une lettre manuscrite', desc: 'Chacun dans son coin du canapé', funny: '' },
  { id: 185, themeId: 'cocooning', title: 'Soirée questions profondes', desc: 'Jeux type "We\'re not really strangers"', funny: '' },
  { id: 186, themeId: 'cocooning', title: 'Trier et encadrer nos souvenirs', desc: 'Billets, photos, petits mots', funny: '' },
  { id: 187, themeId: 'cocooning', title: 'Commencer l\'écriture d\'une histoire', desc: 'Un paragraphe chacun', funny: '' },
  { id: 188, themeId: 'cocooning', title: 'Dîner déguisé à la maison', desc: 'Juste pour le fun de la situation', funny: '' },
  { id: 189, themeId: 'cocooning', title: 'Gratouiller un instrument de musique', desc: 'Ukulélé ou guitare sur le lit', funny: '' },
  { id: 190, themeId: 'cocooning', title: 'Soirée blind test musical', desc: 'Chacun passe ses vieux sons honteux', funny: '' },
  { id: 191, themeId: 'cocooning', title: 'Soirée tatouage éphémère', desc: 'Se dessiner dessus au stylo spécial', funny: '' },
  { id: 192, themeId: 'cocooning', title: 'Créer une capsule temporelle', desc: 'À cacher dans l\'appartement', funny: '' },
  { id: 193, themeId: 'cocooning', title: 'Fabriquer un Date Jar', desc: 'Remplir un bocal de petits mots', funny: '' },
  { id: 194, themeId: 'cocooning', title: 'Se raconter des souvenirs d\'école', desc: 'Ressortir les vieux dossiers', funny: '' },
  { id: 195, themeId: 'cocooning', title: 'Regarder nos vidéos de téléphone', desc: 'Caster sur la télé et rigoler', funny: '' },
  { id: 196, themeId: 'cocooning', title: 'Soirée broderie ou tricot', desc: 'Sur le canapé devant une série', funny: '' },
  { id: 197, themeId: 'cocooning', title: 'Planifier des vacances de rêve', desc: 'Sans budget limite (juste pour rêver)', funny: '' },
  { id: 198, themeId: 'cocooning', title: 'Inventer un rituel du coucher', desc: 'Thé, lecture, 3 kiffs du jour', funny: '' },
  { id: 199, themeId: 'cocooning', title: 'Apprendre à faire du pain', desc: 'Pétrir la pâte à quatre mains', funny: '' },
  { id: 200, themeId: 'cocooning', title: 'Écrire à notre "nous" du futur', desc: 'À sceller dans une enveloppe', funny: '' },

  { id: 201, themeId: 'voyages', title: 'Week-end surprise', desc: 'L\'un décide, l\'autre suit les yeux fermés', funny: '' },
  { id: 202, themeId: 'voyages', title: 'Road trip sans GPS', desc: 'Juste une boussole et on se perd exprès', funny: '' },
  { id: 203, themeId: 'voyages', title: 'Escapade capitale romantique', desc: 'Paris, Rome ou Vienne', funny: '' },
  { id: 204, themeId: 'voyages', title: 'Week-end ibérique', desc: 'Tapas, architecture, soleil', funny: '' },
  { id: 205, themeId: 'voyages', title: 'Retraite dans une ville thermale', desc: 'Soins et casino le soir', funny: '' },
  { id: 206, themeId: 'voyages', title: 'Bord de mer hors saison', desc: 'Huîtres, cirés jaunes et vent', funny: '' },
  { id: 207, themeId: 'voyages', title: 'Route des vins', desc: 'Sillonner les vignobles et déguster', funny: '' },
  { id: 208, themeId: 'voyages', title: 'Week-end culturel en Italie', desc: 'Musées, pâtes et dolce vita', funny: '' },
  { id: 209, themeId: 'voyages', title: 'Voyage nature extrême', desc: 'Islande ou Norvège, cascades et froid', funny: '' },
  { id: 210, themeId: 'voyages', title: 'City-break au Portugal', desc: 'Tramway, pasteis et ruelles', funny: '' },
  { id: 211, themeId: 'voyages', title: 'Venise en automne', desc: 'Acqua alta romantique', funny: '' },
  { id: 212, themeId: 'voyages', title: 'Bretagne sauvage', desc: 'Menhirs, crêpes et tempêtes', funny: '' },
  { id: 213, themeId: 'voyages', title: 'Séjour en mas provençal', desc: 'Lavande, cigales et siestes', funny: '' },
  { id: 214, themeId: 'voyages', title: 'Train de nuit à travers l\'Europe', desc: 'Se réveiller dans un autre pays', funny: '' },
  { id: 215, themeId: 'voyages', title: 'Tournées des grands châteaux', desc: 'Vivre la vie de monarque 2 jours', funny: '' },
  { id: 216, themeId: 'voyages', title: 'Week-end ski + chalet', desc: 'Fondue, vin chaud, feu de bois', funny: '' },
  { id: 217, themeId: 'voyages', title: 'Road trip côte ouest', desc: 'De la pointe bretonne au Pays Basque', funny: '' },
  { id: 218, themeId: 'voyages', title: 'Séjour immersion Asie', desc: 'Kyoto, temples, cerisiers', funny: '' },
  { id: 219, themeId: 'voyages', title: 'Escapade écossaise', desc: 'Châteaux hantés et cornemuse', funny: '' },
  { id: 220, themeId: 'voyages', title: 'Défi 24h chrono dans une ville', desc: 'Arriver, visiter à fond, repartir', funny: '' },
  { id: 221, themeId: 'voyages', title: 'Séjour dans un riad', desc: 'Thé à la menthe, souks, chaleur', funny: '' },
  { id: 222, themeId: 'voyages', title: 'Trek de plusieurs jours', desc: 'Traversée de la Corse ou des Alpes', funny: '' },
  { id: 223, themeId: 'voyages', title: 'Croisière fluviale privée', desc: 'Louer une petite péniche pour deux', funny: '' },
  { id: 224, themeId: 'voyages', title: 'Road trip en van aménagé', desc: 'Liberté totale, dodo face à la mer', funny: '' },
  { id: 225, themeId: 'voyages', title: 'Le grand rêve américain', desc: 'New York, burgers et gratte-ciels', funny: '' },
  { id: 226, themeId: 'voyages', title: 'Île tropicale volcanique', desc: 'Randonnées intenses et plages de sable noir', funny: '' },
  { id: 227, themeId: 'voyages', title: 'Agritourisme en Toscane', desc: 'Vignes, olives, couchers de soleil', funny: '' },
  { id: 228, themeId: 'voyages', title: 'Traverser le pays en train lent', desc: 'Regarder le paysage changer', funny: '' },
  { id: 229, themeId: 'voyages', title: 'Assister à une grande fête locale', desc: 'Feria en Espagne ou Carnaval', funny: '' },
  { id: 230, themeId: 'voyages', title: 'Week-end bière et frites', desc: 'Bruxelles ou Amsterdam à vélo', funny: '' },
  { id: 231, themeId: 'voyages', title: 'Exploration de grandes gorges', desc: 'Verdon, canoë et falaises', funny: '' },
  { id: 232, themeId: 'voyages', title: 'Nuit dans un château-hôtel', desc: 'Luxe, calme et volupté', funny: '' },
  { id: 233, themeId: 'voyages', title: 'Séjour aux mille couleurs', desc: 'Cinque Terre ou côte amalfitaine', funny: '' },
  { id: 234, themeId: 'voyages', title: 'Escapade en Sardaigne', desc: 'Eaux turquoise', funny: '' },
  { id: 235, themeId: 'voyages', title: 'Trajet dans un train panoramique', desc: 'Glacier Express ou Bernina', funny: '' },
  { id: 236, themeId: 'voyages', title: 'Séjour dans les pays Baltes', desc: 'Romantisme médiéval et neige', funny: '' },
  { id: 237, themeId: 'voyages', title: 'Road trip celtique', desc: 'Irlande, falaises, bière brune', funny: '' },
  { id: 238, themeId: 'voyages', title: 'Camping sauvage sur une île', desc: 'Traversée en bateau + Robinson Crusoé', funny: '' },
  { id: 239, themeId: 'voyages', title: 'Nuit troglodytique', desc: 'Dormir dans la roche', funny: '' },
  { id: 240, themeId: 'voyages', title: 'Survol en montgolfière', desc: 'Le monde vu d\'en haut au lever du soleil', funny: '' },

  { id: 241, themeId: 'soirees', title: 'Cocktails au bar d\'un Palace', desc: 'Tenue de soirée exigée', funny: '' },
  { id: 242, themeId: 'soirees', title: 'Soirée jazz dans un speakeasy', desc: 'Trouver l\'adresse cachée', funny: '' },
  { id: 243, themeId: 'soirees', title: 'Dîner + Pièce de théâtre', desc: 'Le combo culturel classique', funny: '' },
  { id: 244, themeId: 'soirees', title: 'Nuit blanche en ville', desc: 'Traîner jusqu\'au petit matin', funny: '' },
  { id: 245, themeId: 'soirees', title: 'Soirée déguisée à deux', desc: 'S\'habiller selon une décennie', funny: '' },
  { id: 246, themeId: 'soirees', title: 'Danser jusqu\'à l\'aube en club', desc: 'Comme au tout début de la relation', funny: '' },
  { id: 247, themeId: 'soirees', title: 'Balade dans la ville illuminée', desc: 'Moment magique en hiver', funny: '' },
  { id: 248, themeId: 'soirees', title: 'Soirée casino', desc: 'James Bond mode : ON 🃏', funny: '' },
  { id: 249, themeId: 'soirees', title: 'Bar immersif thématisé', desc: 'Plonger dans un univers fou', funny: '' },
  { id: 250, themeId: 'soirees', title: 'Feu de camp nocturne', desc: 'Chamallows grillés et guitare', funny: '' },
  { id: 251, themeId: 'soirees', title: 'Participer à un Pub Quiz', desc: 'Forger une équipe imbattable', funny: '' },
  { id: 252, themeId: 'soirees', title: 'Marché de Noël de nuit', desc: 'Vin chaud et marrons', funny: '' },
  { id: 253, themeId: 'soirees', title: 'Marcher sous la pluie battante', desc: 'S\'embrasser sous les lampadaires', funny: '' },
  { id: 254, themeId: 'soirees', title: 'Concert total surprise', desc: 'Prendre des billets au hasard', funny: '' },
  { id: 255, themeId: 'soirees', title: 'Spectacle de drag queens', desc: 'Couleurs, folie et rires', funny: '' },
  { id: 256, themeId: 'soirees', title: 'Midnight snack run', desc: 'Aller chercher à manger à 2h du mat', funny: '' },
  { id: 257, themeId: 'soirees', title: 'Observer un orage dans le noir', desc: 'Fenêtre ouverte, blottis', funny: '' },
  { id: 258, themeId: 'soirees', title: 'Faire des crêpes à minuit', desc: 'L\'appétit nocturne', funny: '' },
  { id: 259, themeId: 'soirees', title: 'Prendre une chambre d\'hôtel dans sa ville', desc: 'Casser la routine', funny: '' },
  { id: 260, themeId: 'soirees', title: 'Tour des bars à vin nature', desc: 'Déguster des choses étranges', funny: '' },
  { id: 261, themeId: 'soirees', title: 'Mystery Dinner à domicile', desc: 'Cuisiner des plats improbables', funny: '' },
  { id: 262, themeId: 'soirees', title: 'Bain chaud extérieur (nordique)', desc: 'Corps chaud, tête froide', funny: '' },
  { id: 263, themeId: 'soirees', title: 'Soirée tirage de tarot', desc: 'Même pour rire de l\'avenir', funny: '' },
  { id: 264, themeId: 'soirees', title: 'Tournoi dans un bar à jeux', desc: 'Jouer entourés d\'inconnus', funny: '' },
  { id: 265, themeId: 'soirees', title: 'Slow dance improvisée', desc: 'Une valse au milieu du salon', funny: '' },
  { id: 266, themeId: 'soirees', title: 'Apéritif au lever de la lune pleine', desc: 'Un moment rare', funny: '' },
  { id: 267, themeId: 'soirees', title: 'Soirée cheminée exclusive', desc: 'Juste fixer les flammes', funny: '' },
  { id: 268, themeId: 'soirees', title: 'Nuit dans une bulle transparente', desc: 'Dormir avec les étoiles', funny: '' },
  { id: 269, themeId: 'soirees', title: 'Dégustation champagne exclusive', desc: 'Soirée ultra luxueuse à la maison', funny: '' },
  { id: 270, themeId: 'soirees', title: 'Balade en calèche de nuit', desc: 'Un côté vieille époque', funny: '' },
  { id: 271, themeId: 'soirees', title: 'Soirée revival années 80', desc: 'Musique disco et tenues fluo', funny: '' },
  { id: 272, themeId: 'soirees', title: 'Nuit dans une yourte isolée', desc: 'Se couper du monde', funny: '' },
  { id: 273, themeId: 'soirees', title: 'Dîner perché sur un toit', desc: 'Repas avec vue imprenable', funny: '' },
  { id: 274, themeId: 'soirees', title: 'Prendre le dernier métro au hasard', desc: 'Voir où il vous mène', funny: '' },
  { id: 275, themeId: 'soirees', title: 'Soirée 100% bougies', desc: 'Électricité coupée toute la soirée', funny: '' },

  { id: 276, themeId: 'creativite', title: 'Créer un tableau abstrait géant', desc: 'Jeter de la peinture partout', funny: '' },
  { id: 277, themeId: 'creativite', title: 'Apprendre à coudre', desc: 'Faire un vêtement pour l\'autre', funny: '' },
  { id: 278, themeId: 'creativite', title: 'Fabriquer des bougies sculptées', desc: 'Mélanger cire et parfums', funny: '' },
  { id: 279, themeId: 'creativite', title: 'Se faire des tatouages au henné', desc: 'Se dessiner dessus', funny: '' },
  { id: 280, themeId: 'creativite', title: 'Composer une petite chanson', desc: 'Même si c\'est nul, c\'est drôle', funny: '' },
  { id: 281, themeId: 'creativite', title: 'Créer un herbier', desc: 'Fleurs séchées de vos balades', funny: '' },
  { id: 282, themeId: 'creativite', title: 'Tourner un vlog de votre journée', desc: 'Montage le soir', funny: '' },
  { id: 283, themeId: 'creativite', title: 'Fabriquer un magazine sur vous', desc: 'Un "Fanzine" de couple', funny: '' },
  { id: 284, themeId: 'creativite', title: 'Peindre des pots de plantes', desc: 'Pour égayer le balcon', funny: '' },
  { id: 285, themeId: 'creativite', title: 'Teindre des vêtements naturellement', desc: 'Avec betterave ou oignon', funny: '' },
  { id: 286, themeId: 'creativite', title: 'Construire un terrarium fermé', desc: 'Un mini-monde sous verre', funny: '' },
  { id: 287, themeId: 'creativite', title: 'Faire un Bullet Journal à deux', desc: 'Organiser votre année de façon arty', funny: '' },
  { id: 288, themeId: 'creativite', title: 'Peindre des cartes postales', desc: 'Et se les envoyer par la poste', funny: '' },
  { id: 289, themeId: 'creativite', title: 'Construire un petit meuble en bois', desc: 'Scier, clouer, peindre', funny: '' },
  { id: 290, themeId: 'creativite', title: 'Faire un film en stop-motion', desc: 'Avec des objets du quotidien', funny: '' },
  { id: 291, themeId: 'creativite', title: 'Apprendre à tresser des cordes', desc: 'Faire des nœuds marins', funny: '' },
  { id: 292, themeId: 'creativite', title: 'Peinture sur verre ou vitrail', desc: 'Décorer une fenêtre', funny: '' },
  { id: 293, themeId: 'creativite', title: 'Créer des bijoux personnalisés', desc: 'Perles, résine, fil de fer', funny: '' },
  { id: 294, themeId: 'creativite', title: 'Faire un scrapbook physique', desc: 'Imprimer et coller des photos', funny: '' },
  { id: 295, themeId: 'creativite', title: 'Pyrogravure sur bois', desc: 'Brûler vos initiales sur un objet', funny: '' },
  { id: 296, themeId: 'creativite', title: 'Faire son propre savon solide', desc: 'Mélange d\'huiles et soude', funny: '' },
  { id: 297, themeId: 'creativite', title: 'Enregistrer un podcast fictif', desc: 'Parler dans un micro juste pour vous', funny: '' },
  { id: 298, themeId: 'creativite', title: 'Rénover un vieux meuble de brocante', desc: 'Upcycling complet', funny: '' },
  { id: 299, themeId: 'creativite', title: 'Apprendre à dessiner des visages', desc: 'Se tirer le portrait (souvent raté)', funny: '' },
  { id: 300, themeId: 'creativite', title: 'Broder sur une veste en jean', desc: 'Customisation stylée', funny: '' },
  { id: 301, themeId: 'creativite', title: 'Préparer une box cadeau surprise', desc: 'Thématisée pour l\'autre', funny: '' },
  { id: 302, themeId: 'creativite', title: 'Faire des confitures maison', desc: 'Avec des fruits moches sauvés', funny: '' },
  { id: 303, themeId: 'creativite', title: 'Graver un tampon enclino', desc: 'Linogravure artisanale', funny: '' },
  { id: 304, themeId: 'creativite', title: 'Dessiner l\'autre les yeux fermés', desc: 'Fous rires garantis', funny: '' },
  { id: 305, themeId: 'creativite', title: 'Apprendre à jongler', desc: 'Fabriquer des balles et essayer', funny: '' },
  { id: 306, themeId: 'creativite', title: 'Sculpter dans l\'argile', desc: 'Sans tour de potier, juste à la main', funny: '' },
  { id: 307, themeId: 'creativite', title: 'Fabriquer un projecteur smartphone', desc: 'Avec une boîte à chaussures', funny: '' },
  { id: 308, themeId: 'creativite', title: 'Tresser des paniers', desc: 'Vannerie relaxante', funny: '' },
  { id: 309, themeId: 'creativite', title: 'Écrire un recueil de poèmes', desc: 'Même si c\'est des haïkus ridicules', funny: '' },
  { id: 310, themeId: 'creativite', title: 'Faire 1000 grues en origami', desc: 'Le vœu ultime japonais', funny: '' },

  { id: 311, themeId: 'bienetre', title: 'Journée spa 5 étoiles', desc: 'Hammam, bain japonais, luxe absolu', funny: '' },
  { id: 312, themeId: 'bienetre', title: 'Bain thermal naturel extérieur', desc: 'Eau chaude sous l\'air frais', funny: '' },
  { id: 313, themeId: 'bienetre', title: 'Retraite yoga de deux jours', desc: 'Reconnexion spirituelle', funny: '' },
  { id: 314, themeId: 'bienetre', title: 'Massage aux pierres chaudes duo', desc: 'Détente musculaire profonde', funny: '' },
  { id: 315, themeId: 'bienetre', title: 'Séance de bain sonore (Sound Bath)', desc: 'Bols tibétains et ondes', funny: '' },
  { id: 316, themeId: 'bienetre', title: 'Flottaison en isolation sensorielle', desc: 'Le vide total ensemble', funny: '' },
  { id: 317, themeId: 'bienetre', title: 'Hammam et thé à la menthe', desc: 'Rituel purifiant', funny: '' },
  { id: 318, themeId: 'bienetre', title: 'Cure de silence de 24h', desc: 'S\'interdire de parler, juste ressentir', funny: '' },
  { id: 319, themeId: 'bienetre', title: 'Initiation à la méditation', desc: 'Se centrer sur sa respiration', funny: '' },
  { id: 320, themeId: 'bienetre', title: 'Journée 0 écran stricte', desc: 'Téléphones confisqués', funny: '' },
  { id: 321, themeId: 'bienetre', title: 'Sylvothérapie guidée', desc: 'Câliner des arbres (pour de vrai)', funny: '' },
  { id: 322, themeId: 'bienetre', title: 'Séance d\'acupuncture', desc: 'Tester la médecine douce', funny: '' },
  { id: 323, themeId: 'bienetre', title: 'Thalasso en bord de mer', desc: 'Algues et eau salée revigorante', funny: '' },
  { id: 324, themeId: 'bienetre', title: 'Massage crânien à l\'indienne', desc: 'Le summum de la détente', funny: '' },
  { id: 325, themeId: 'bienetre', title: 'Atelier de cohérence cardiaque', desc: 'Apprendre à respirer', funny: '' },
  { id: 326, themeId: 'bienetre', title: 'Spa nordique (Chaud/Froid)', desc: 'Le contraste qui réveille', funny: '' },
  { id: 327, themeId: 'bienetre', title: 'Lecture au coin du feu', desc: 'Sans musique, juste le crépitement', funny: '' },
  { id: 328, themeId: 'bienetre', title: 'Cérémonie du cacao sacré', desc: 'Ouvrir le chakra du cœur', funny: '' },
  { id: 329, themeId: 'bienetre', title: 'Digital detox à la campagne', desc: 'Respirer le purin', funny: '' },
  { id: 330, themeId: 'bienetre', title: 'Respiration Wim Hof', desc: 'Hyperventilation et froid', funny: '' },
  { id: 331, themeId: 'bienetre', title: 'Séance de sophrologie', desc: 'Lâcher prise mentalement', funny: '' },
  { id: 332, themeId: 'bienetre', title: 'Hypnose de relaxation douce', desc: 'S\'évader sans bouger', funny: '' },
  { id: 333, themeId: 'bienetre', title: 'Rituel d\'auto-massage duo', desc: 'Se badigeonner d\'huiles neutres', funny: '' },
  { id: 334, themeId: 'bienetre', title: 'Cure de jus d\'une journée', desc: 'Détoxifier le corps', funny: '' },
  { id: 335, themeId: 'bienetre', title: 'Bain de soleil total isolé', desc: 'Recharger la vitamine D', funny: '' },

  { id: 336, themeId: 'saisonnier', title: 'Fêter les mensiversaires', desc: 'Un cupcake avec une bougie chaque mois', funny: '' },
  { id: 337, themeId: 'saisonnier', title: 'Reproduire le 1er date exact', desc: 'Même vêtements, mêmes blagues', funny: '' },
  { id: 338, themeId: 'saisonnier', title: 'Lettre d\'amour inattendue', desc: 'Glissée dans le manteau le matin', funny: '' },
  { id: 339, themeId: 'saisonnier', title: 'Soirée lune de miel chez soi', desc: 'Pétales, champagne, on sort le grand jeu', funny: '' },
  { id: 340, themeId: 'saisonnier', title: 'Célébrer un micro-succès', desc: 'Une petite réussite = une grande fête', funny: '' },
  { id: 341, themeId: 'saisonnier', title: 'Anti-Saint-Valentin', desc: 'Fêter l\'amour un jour au pif', funny: '' },
  { id: 342, themeId: 'saisonnier', title: 'Journée complète au lit', desc: 'Interdit d\'en sortir sauf urgence', funny: '' },
  { id: 343, themeId: 'saisonnier', title: 'Dîner "yeux bandés" surprise', desc: 'L\'un emmène l\'autre sans dire où', funny: '' },
  { id: 344, themeId: 'saisonnier', title: 'Créer un rituel matinal', desc: 'Café, câlin, agenda', funny: '' },
  { id: 345, themeId: 'saisonnier', title: 'Planter une fleur pour l\'anniversaire', desc: 'Une rose de couple', funny: '' },
  { id: 346, themeId: 'saisonnier', title: 'Se faire un tatouage commun', desc: 'Acte très (très) engageant', funny: '' },
  { id: 347, themeId: 'saisonnier', title: 'Flânerie sous une averse d\'été', desc: 'Finir trempés', funny: '' },
  { id: 348, themeId: 'saisonnier', title: 'Revoir le 1er film vu ensemble', desc: 'Pure nostalgie', funny: '' },
  { id: 349, themeId: 'saisonnier', title: 'Cuisiner le plat de la rencontre', desc: 'Madeleine de Proust', funny: '' },
  { id: 350, themeId: 'saisonnier', title: 'Soirée interview profonde', desc: 'S\'enregistrer à vif', funny: '' },
  { id: 351, themeId: 'saisonnier', title: 'Cueillette de pommes en automne', desc: 'Et tarte Tatin au retour', funny: '' },
  { id: 352, themeId: 'saisonnier', title: 'Bataille de feuilles mortes', desc: 'En forêt en octobre', funny: '' },
  { id: 353, themeId: 'saisonnier', title: 'Refaire une très vieille photo', desc: 'Retour sur les lieux', funny: '' },
  { id: 354, themeId: 'saisonnier', title: 'Créer un musée de notre couple', desc: 'Exposer les tickets de cinés', funny: '' },
  { id: 355, themeId: 'saisonnier', title: 'Journée esclave', desc: 'L\'un obéit à l\'autre 24h', funny: '' },
  { id: 356, themeId: 'saisonnier', title: 'Lecture tragique d\'horoscopes', desc: 'Avec une voix dramatique', funny: '' },
  { id: 357, themeId: 'saisonnier', title: 'Dormir dehors la nuit du solstice', desc: 'Nuit la plus courte, à la belle étoile', funny: '' },
  { id: 358, themeId: 'saisonnier', title: 'Déterrer une capsule temporelle', desc: 'Et pleurer devant', funny: '' },
  { id: 359, themeId: 'saisonnier', title: 'Se faire une promesse de fin d\'année', desc: 'Pour l\'an prochain', funny: '' },
  { id: 360, themeId: 'saisonnier', title: 'Fêter le premier "Je t\'aime"', desc: 'La date fondatrice secrète', funny: '' },
  { id: 361, themeId: 'saisonnier', title: 'Nuit blanche à discuter', desc: 'Vider son sac de pensées', funny: '' },
  { id: 362, themeId: 'saisonnier', title: 'Poème sous l\'oreiller', desc: 'Petite attention de bon matin', funny: '' },
  { id: 363, themeId: 'saisonnier', title: 'Danser dans la cuisine', desc: 'Pendant que les pâtes cuisent', funny: '' },
  { id: 364, themeId: 'saisonnier', title: 'Premier film de l\'année à minuit', desc: 'Le 31 décembre', funny: '' },
  { id: 365, themeId: 'saisonnier', title: 'Bilan de l\'année ensemble', desc: 'Relire les 364 archives d\'activités', funny: '' },

  // === CÂLINS & FRISSONS — Niveau Tendresse ===
  { id: 366, themeId: 'calin', title: 'Bain moussant aux pétales de rose', desc: 'Bougies, huiles essentielles, musique douce', funny: '🌸 Tendresse' },
  { id: 367, themeId: 'calin', title: 'Massage dos express de 20 minutes', desc: 'Pas besoin d\'être kiné, juste doux', funny: '🌸 Tendresse' },
  { id: 368, themeId: 'calin', title: 'Se regarder dans les yeux 4 minutes', desc: 'L\'exercice scientifique qui génère une connexion aussi forte que des années ensemble', funny: '🌸 Tendresse' },
  { id: 369, themeId: 'calin', title: 'Câlin cuillère sous les draps', desc: 'Aucun téléphone. Juste vous deux.', funny: '🌸 Tendresse' },
  { id: 370, themeId: 'calin', title: 'Blind massage', desc: 'Les yeux bandés. Deviner les zones effleurées. Ne rien demander d\'autre', funny: '🌸 Tendresse' },
  { id: 371, themeId: 'calin', title: 'Slow dance dans le salon', desc: 'Sans musique, juste le silence et le poids de l\'autre contre soi', funny: '🌸 Tendresse' },
  { id: 372, themeId: 'calin', title: 'Lire à voix haute', desc: 'Allongés, tête sur les genoux. La voix de l\'autre comme berceuse', funny: '🌸 Tendresse' },
  { id: 373, themeId: 'calin', title: 'Soirée sans téléphone', desc: 'Juste vous deux. Pas d\'écrans, pas d\'excuse de ne pas se regarder', funny: '🌸 Tendresse' },
  { id: 374, themeId: 'calin', title: 'Câlin marathon 20 minutes', desc: 'Sans bouger. Sans parler. Juste sentir la respiration se synchroniser', funny: '🌸 Tendresse' },
  { id: 375, themeId: 'calin', title: 'Massage crânien au coucher', desc: 'Le meilleur somnifère naturel — et le plus efficace pour dire "je prends soin de toi"', funny: '🌸 Tendresse' },
  { id: 376, themeId: 'calin', title: 'Dessiner sur le dos de l\'autre', desc: 'L\'autre devine. Ça commence innocent, ça finit rarement là', funny: '🌸 Tendresse' },
  { id: 377, themeId: 'calin', title: 'Rituel de coucher luxueux', desc: 'Créer un rituel propre à vous deux — huiles, musique, gestes dans le même ordre. Chaque nuit', funny: '🌸 Tendresse' },

  // === CÂLINS & FRISSONS — Niveau Étincelles ===
  { id: 378, themeId: 'calin', title: 'Strip questionnaire intime', desc: 'Répondre ou retirer une pièce. On ne s\'arrête pas à mi-chemin 😈', funny: '🔥 Étincelles' },
  { id: 379, themeId: 'calin', title: 'Massage à l\'aveugle', desc: 'Les yeux bandés, l\'un masse l\'autre de la tête aux pieds. Seuls "plus fort" ou "plus doux" sont autorisés', funny: '🔥 Étincelles' },
  { id: 380, themeId: 'calin', title: 'Soirée photos intimes', desc: 'Photographe pro pour la soirée. Poses, lumières, regard. L\'appareil ne ment pas 📷', funny: '🔥 Étincelles' },
  { id: 381, themeId: 'calin', title: 'Soirée lingerie surprise', desc: 'Chacun s\'habille pour faire de l\'effet — pas forcément pour longtemps', funny: '🔥 Étincelles' },
  { id: 382, themeId: 'calin', title: 'Playlist qu\'on s\'envoie avant', desc: 'Chacun compose sa bande-son pour la soirée. On les écoute dans l\'ordre, sans savoir ce qui vient', funny: '🔥 Étincelles' },
  { id: 383, themeId: 'calin', title: 'Bain de minuit', desc: 'À une heure improbable, sans prévenir — parce que c\'est exactement pour ça', funny: '🔥 Étincelles' },
  { id: 384, themeId: 'calin', title: 'Soirée sans lumière artificielle', desc: 'Uniquement des bougies. Voir l\'autre comme jamais', funny: '🔥 Étincelles' },
  { id: 385, themeId: 'calin', title: 'Blind taste kiss', desc: 'Goûter les mêmes saveurs les yeux bandés — et se les faire deviner autrement', funny: '🔥 Étincelles' },
  { id: 386, themeId: 'calin', title: 'Jeu de cartes coquin maison', desc: 'Fabriquer ses propres règles ensemble : une carte = une instruction écrite par l\'autre. Aucun joker', funny: '🔥 Étincelles' },
  { id: 387, themeId: 'calin', title: 'Écrire ce qu\'on aime chez l\'autre', desc: 'Sur le corps, au feutre corporel. Un mot par zone. À lire ensemble après', funny: '🔥 Étincelles' },
  { id: 388, themeId: 'calin', title: 'Séduction from scratch', desc: 'On fait comme si on se rencontrait pour la première fois. Drague, tension — sans s\'arrêter au baiser', funny: '🔥 Étincelles' },
  { id: 389, themeId: 'calin', title: 'Tatouage éphémère intime', desc: 'Se dessiner un symbole discret à un endroit que personne d\'autre ne verra', funny: '🔥 Étincelles' },

  // === CÂLINS & FRISSONS — Niveau Flame ===
  { id: 390, themeId: 'calin', title: 'Soirée jeu de rôle', desc: 'Scénario écrit ensemble en avance — infirmière, inconnus dans un bar, interdit... Le casting est libre', funny: '💋 Flame' },
  { id: 391, themeId: 'calin', title: 'Réveil doux surprise', desc: 'L\'un prépare quelque chose pour l\'autre au lever. Café, fraise, caresse — à lui d\'inventer', funny: '💋 Flame' },
  { id: 392, themeId: 'calin', title: 'Soirée "oui à tout"', desc: 'L\'un dit oui à toutes les demandes de l\'autre. Sans limite de temps. Rôles inversés après', funny: '💋 Flame' },
  { id: 393, themeId: 'calin', title: 'Soirée "fantasme révélé"', desc: 'Chacun écrit son fantasme sur un papier. On échange, on lit à voix haute... et on vote pour ce soir', funny: '💋 Flame' },
  { id: 394, themeId: 'calin', title: 'Le défi des 10 minutes', desc: 'Un minuteur. 10 minutes chacun. L\'un a le contrôle total, l\'autre suit. À la sonnerie, les rôles s\'inversent', funny: '💋 Flame' },
  { id: 395, themeId: 'calin', title: 'Nuit blanche romantique', desc: 'Interdiction de dormir. On parle, on touche, on laisse passer l\'aube', funny: '💋 Flame' },
  { id: 396, themeId: 'calin', title: 'Chuchoter pendant 1h', desc: 'Parler uniquement à voix basse toute la soirée. Ça crée une intimité étrange et addictive', funny: '💋 Flame' },
  { id: 397, themeId: 'calin', title: 'La liste interdite', desc: 'Chacun écrit 3 choses qu\'il n\'a jamais osé demander. On pose les papiers sur la table. Ce soir, on en choisit une.', funny: '💋 Flame' },
  { id: 398, themeId: 'calin', title: 'Dîner les yeux bandés', desc: 'L\'un mange les yeux bandés, l\'autre choisit ce qu\'il lui donne, comment, à quel rythme. Les rôles s\'inversent au dessert 🕯️', funny: '💋 Flame' },

  // === JEUX ===
  { id: 399, themeId: 'jeux', title: 'Quiz "Tu me connais ?"', desc: '20 questions sur l\'autre, préparées à l\'avance. Le score compte. L\'orgueil aussi', funny: '🎯 Jeux' },
  { id: 400, themeId: 'jeux', title: 'Fléchettes avec gages', desc: 'Chaque zone = un gage tiré au sort. La bull\'s eye = le gage ultime que l\'autre invente 👀', funny: '🎯 Jeux' },
  { id: 401, themeId: 'jeux', title: 'Morpion géant au sol', desc: 'Masking tape sur le carrelage. Cases assez grandes pour qu\'on soit soi-même les pions', funny: '🎯 Jeux' },
  { id: 402, themeId: 'jeux', title: 'Défi cuisine 15 min chrono', desc: 'Frigo aléatoire, timer lancé. L\'autre goûte les yeux bandés et note sans diplomatie', funny: '🎯 Jeux' },
  { id: 403, themeId: 'jeux', title: 'Blind drawing', desc: 'L\'un décrit un objet ou un lieu sans le nommer. L\'autre dessine. Résultats souvent catastrophiques', funny: '🎯 Jeux' },
  { id: 404, themeId: 'jeux', title: 'Jeu de rôle négociation', desc: 'Vendre à l\'autre l\'objet le plus inutile de la maison. Pitch de 3 min. Le perdant fait la vaisselle de la semaine', funny: '🎯 Jeux' },
  { id: 405, themeId: 'jeux', title: 'Défi équilibre', desc: 'Qui tient le plus longtemps sur un pied ? Variante : les yeux fermés, les bras croisés. Plus dur qu\'il n\'y paraît', funny: '🎯 Jeux' },
  { id: 406, themeId: 'jeux', title: 'Memory maison', desc: 'Dos des cartes à jouer + photos imprimées de vous deux. Nostalgique et compétitif', funny: '🎯 Jeux' },
  { id: 407, themeId: 'jeux', title: 'Défi impro discours', desc: 'Sujet tiré au sort. 2 minutes de préparation. L\'autre note sur 10 avec commentaires publics', funny: '🎯 Jeux' },
  { id: 408, themeId: 'jeux', title: 'Défi calligraphie', desc: 'Qui reproduit le mieux un caractère arabe, chinois ou coréen ? On vote à la fin comme un jury', funny: '🎯 Jeux' },
  { id: 409, themeId: 'jeux', title: 'Jeu du mensonge', desc: '3 anecdotes, 1 est inventée. L\'autre a droit à 3 questions. Aucune ne doit trahir', funny: '🎯 Jeux' },
  { id: 410, themeId: 'jeux', title: 'Défi imitation', desc: 'Imiter une personne que vous connaissez tous les deux. L\'autre devine sans rire. Spoiler : impossible', funny: '🎯 Jeux' },
  { id: 411, themeId: 'jeux', title: 'Défi : écrire avec l\'autre main', desc: 'La plus belle signature gagne. On encadre le résultat pour l\'humiliation à long terme', funny: '🎯 Jeux' },
  { id: 412, themeId: 'jeux', title: 'Jeu des tabous maison', desc: 'Faire deviner un mot sans utiliser les 5 mots interdits — sous la pression du chrono', funny: '🎯 Jeux' },
  { id: 413, themeId: 'jeux', title: 'Défi sport à la maison', desc: '10 pompes, 10 squats, 10 burpees. Qui pose les mains en premier achète l\'apéro', funny: '🎯 Jeux' },
  { id: 414, themeId: 'jeux', title: 'Post-it sur le front', desc: 'Deviner le mot collé en posant des questions fermées. Variante : personnalités ou souvenirs communs', funny: '🎯 Jeux' },
  { id: 415, themeId: 'jeux', title: 'Défi : reproduire un plat de chef', desc: 'Avec seulement une photo comme référence. Noté sur présentation, goût, et effort visible', funny: '🎯 Jeux' },
  { id: 416, themeId: 'jeux', title: 'Tennis de table improvisé', desc: 'Table + livres empilés en filet + couvercles comme raquettes. Règles maison acceptées', funny: '🎯 Jeux' },
  { id: 417, themeId: 'jeux', title: 'Quiz cinéma blind test', desc: 'Deviner le film à la bande-son. Niveau difficile : les BO sans paroles ni chanson', funny: '🎯 Jeux' },
  { id: 418, themeId: 'jeux', title: 'Mot interdit de la journée', desc: 'L\'autre choisit ton mot banni. On se surveille mutuellement avec une joie franchement mauvaise 😈', funny: '🎯 Jeux' },
  { id: 419, themeId: 'jeux', title: 'Défi origami chrono', desc: 'Plier la meilleure grue en 3 minutes. Les essais ratés restent sur la table comme preuves', funny: '🎯 Jeux' },
  { id: 420, themeId: 'jeux', title: 'Défi : apprendre un tour de magie', desc: 'Maîtriser un tour en 30 minutes, l\'exécuter devant l\'autre sans se faire démasquer', funny: '🎯 Jeux' },
  { id: 421, themeId: 'jeux', title: 'Course aux étoiles', desc: 'Premier à identifier 5 constellations cette nuit-là — avec app autorisée ou non, à vous de décider', funny: '🎯 Jeux' },
  { id: 422, themeId: 'jeux', title: 'Défi : faire rire l\'autre en 1 minute', desc: 'Sans le toucher. Sans crier. Chronométré. Stratégie et timing sont tout', funny: '🎯 Jeux' },
  { id: 423, themeId: 'jeux', title: 'Défi photo artistique', desc: 'Même sujet, chacun le photographie à sa façon. On compare et on se juge avec toute la sévérité qu\'on mérite', funny: '🎯 Jeux' },
  { id: 424, themeId: 'jeux', title: 'Jeu de société interdit', desc: 'Le plus compétitif que vous possédez. Règles strictes. Pas de clémence', funny: '🎯 Jeux' },
  { id: 425, themeId: 'jeux', title: 'Tournoi de 5 mini-jeux', desc: 'Pierre-feuille-ciseaux, 421, devinettes, souffler une boulette, memory. Le perdant fait la vaisselle — le gagnant choisit le film', funny: '🎯 Jeux' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [isDark, setIsDark] = useState(false);
  const [activities, setActivities] = useState([]);
  const { currentUser, loading, logout } = useAuth();

useEffect(() => {
  if (!loading && currentUser) {
    setCurrentView('dashboard');
  }
}, [currentUser, loading]);

useEffect(() => {
  supabase.from('activities').select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data && data.length > 0) {
        const normalized = data.map(a => ({
          ...a,
          themeId: a.theme_id ?? a.themeId,
          desc: a.description ?? a.desc,
        }));
        setActivities([...INITIAL_ACTIVITIES, ...normalized]);
      } else {
        setActivities(INITIAL_ACTIVITIES);
      }
    });
}, []);

// Ajouter cet useEffect après les autres :
useEffect(() => {
  if (!loading && currentUser) {
    setCurrentView('dashboard');
  }
}, [currentUser, loading]); 
  const [archives, setArchives] = useState([])
  const [archiveToDelete, setArchiveToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('gastro'); 
  const [activeDetail, setActiveDetail] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  
  const [pin, setPin] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [actForm, setActForm] = useState({ id: null, themeId: 'gastro', title: '', desc: '', funny: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const [activityToDelete, setActivityToDelete] = useState(null);

  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);
  const hasTailwindCdn = Boolean(globalThis?.tailwind); 
  const [isShuffling, setIsShuffling] = useState(false);

  const [asstThemes, setAsstThemes] = useState([]);
  const [asstCards, setAsstCards] = useState([]);
  const [blindStep, setBlindStep] = useState(0); 
  const [blindSelection, setBlindSelection] = useState([]);
  const [p1Choice, setP1Choice] = useState(null);
  const [p2Choice, setP2Choice] = useState(null);

  useEffect(() => {
  const fetchArchives = async () => {
    if (!currentUser) return;
  supabase.from('archives').select('*')
  .eq('user_id', currentUser.id)
  .order('archived_at', { ascending: false })
    if (data) setArchives(data)
  }
  fetchArchives()
}, [])

  const t = isDark ? {
    textMain: 'text-white',
    textMuted: 'text-white/60',
    cardBase: 'bg-white/5 border border-white/10 shadow-lg backdrop-blur-md',
    btnPrimary: 'bg-gradient-to-r from-[#6b3074] to-[#4A2545] text-white shadow-lg shadow-purple-900/50',
    btnSecondary: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
    modalBg: 'bg-[#2D142C]/95 border-purple-500/30',
    accent: 'text-purple-300',
    inputBg: 'bg-black/20 border-white/10 focus:border-purple-400 text-white placeholder-white/40',
    pinBtn: 'bg-white/10 hover:bg-white/20 text-white'
  } : {
    textMain: 'text-[#2D1B2E]', 
    textMuted: 'text-[#756677]', 
    cardBase: 'bg-white border border-[#EAE5E0] shadow-sm',
    btnPrimary: 'bg-gradient-to-r from-[#593C60] to-[#7D5385] text-white shadow-md shadow-purple-200', 
    btnSecondary: 'bg-white text-[#593C60] border-[#EAE5E0] hover:bg-[#F0EBEF]',
    modalBg: 'bg-white/95 border-[#EAE5E0]',
    accent: 'text-[#593C60]',
    inputBg: 'bg-[#F9F8F6] border-[#EAE5E0] focus:border-[#8E6494] text-[#2D1B2E] placeholder-[#756677]/60',
    pinBtn: 'bg-white border-[#EAE5E0] hover:bg-[#F0EBEF] text-[#593C60] shadow-sm'
  };

  const handlePinPress = (digit) => {
    if (digit === 'del') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
  supabase.from('config').select('value').eq('key', 'pin').single()
    .then(({ data }) => {
      if (data?.value === newPin) {
        setCurrentView('dashboard');
      }
      setPin('');
    });
}
    }
  };

  const openAddModal = () => {
    setActForm({ id: null, themeId: activeTab, title: '', desc: '', funny: '' });
    setShowFormModal(true);
  };

  const openEditModal = (activity) => {
    setActForm({ ...activity });
    setActiveDetail(null); 
    setShowFormModal(true);
  };

  const handleSaveActivity = async () => {
  if (!actForm.title || !actForm.desc) return;
  if (actForm.id) {
    await supabase.from('activities').update({
  theme_id: actForm.themeId, title: actForm.title,
  description: actForm.desc, funny: actForm.funny
  }).eq('id', actForm.id).eq('user_id', currentUser?.id);
    setActivities(activities.map(a => a.id === actForm.id ? {...a, ...actForm} : a));
  } else {
    const { data } = await supabase.from('activities')
    .insert({ theme_id: actForm.themeId, title: actForm.title, description: actForm.desc, funny: actForm.funny, user_id: currentUser?.id })      .select().single();
    if (data) setActivities([data, ...activities]);
  }
  setShowFormModal(false);
};

  const confirmDelete = async () => {
  if (activityToDelete) {
  await supabase.from('activities').delete()
  .eq('id', activityToDelete.id)
  .eq('user_id', currentUser?.id);    setActivities(activities.filter(a => a.id !== activityToDelete.id));
    setActivityToDelete(null);
    setActiveDetail(null);
  }
};

  const confirmActivity = () => {
    setActiveDetail(null); 
    setShowVictory(true);  
    setTimeout(() => {
      setShowVictory(false);
      setCurrentActivity(activeDetail || activities.find(a => a.id === p1Choice)); 
      setCurrentView('dashboard');
    }, 2500);
  };

  const startShuffling = (callback) => {
    setIsShuffling(true);
    setTimeout(() => {
      callback();
      setIsShuffling(false);
    }, 1500);
  };

  const archiveActivity = async () => {
  await supabase.from('archives').insert({
    activity_title: currentActivity?.title,
    rating,
    comment
  })
  setShowCompletion(false)
  setShowArchiveSuccess(true)
  setTimeout(() => {
    setShowArchiveSuccess(false)
    setCurrentActivity(null)
    setRating(0)
    setComment("")
    setCurrentView('dashboard')
  }, 2500)
}

  const renderAuth = () => (
    <div className="auth-screen flex flex-col items-center justify-center h-full px-8 animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <div className="text-center mb-8">
        <h1 className="brand-title text-6xl amow-font tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] via-[#8E6494] to-[#593C60] drop-shadow-sm font-bold">
          AMOW
        </h1>
        <p className={`${t.textMuted} mt-3 text-sm uppercase tracking-widest font-bold`}>Code Secret</p>
      </div>

      <div className="pin-dots flex justify-center gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`pin-dot w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              pin.length > i 
                ? (isDark ? 'pin-dot--filled bg-purple-400 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]' : 'pin-dot--filled bg-[#593C60] border-[#593C60]') 
                : (isDark ? 'border-white/30' : 'border-[#D1C8D4]')
            }`} 
          />
        ))}
      </div>

      <div className="pin-grid grid grid-cols-3 gap-6 max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => handlePinPress(num.toString())}
            className={`pin-key w-16 h-16 rounded-full text-2xl font-light flex items-center justify-center active:scale-90 transition-all border ${t.pinBtn}`}
          >
            {num}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handlePinPress('0')}
          className={`pin-key w-16 h-16 rounded-full text-2xl font-light flex items-center justify-center active:scale-90 transition-all border ${t.pinBtn}`}
        >
          0
        </button>
        <button 
          onClick={() => handlePinPress('del')}
          className={`pin-key w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border ${t.pinBtn}`}
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const ActivityCard = ({ activity, index, onClick }) => {
    const theme = THEMES.find(t => t.id === activity.themeId);
    const Icon = theme.icon;
    const dynamicStyle = isDark ? theme.cardDark : theme.cardLight;
    const colorStyle = isDark ? theme.colorDark : theme.colorLight;

    return (
      <button 
        onClick={onClick}
        className={`w-full p-5 relative overflow-hidden flex items-center justify-between group text-left active:scale-95 transition-all duration-500 animate-deal rounded-2xl border shadow-sm ${dynamicStyle}`}
        style={{ animationDelay: `${(index % 15) * 60}ms` }} 
      >
        <Icon className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${isDark ? 'text-white' : 'text-black'}`} />
        
        <div className="pr-4 relative z-10">
          <div className="flex items-center gap-2 mb-1">
             <Icon className={`w-4 h-4 ${colorStyle}`} />
             <span className={`text-[10px] font-bold uppercase tracking-wider ${colorStyle}`}>{theme.name}</span>
          </div>
          <h3 className={`${t.textMain} font-medium text-lg leading-tight transition-colors duration-500`}>{activity.title}</h3>
          <p className={`${t.textMuted} text-sm mt-1 font-light transition-colors duration-500 line-clamp-1`}>{activity.description || activity.desc}</p>
        </div>
        
        <div className={`w-8 h-8 relative z-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-white/10 group-hover:bg-white/20 text-white/70 group-hover:text-white' : 'bg-white/60 border border-black/5 group-hover:bg-white text-black/40 group-hover:text-black/80 shadow-sm'}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    );
  };

  const renderFormModal = () => {
    if (!showFormModal) return null;
    const isEdit = actForm.id !== null;
    
    return (
      <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble`}>
          <h3 className={`text-2xl font-medium ${t.textMain}`}>{isEdit ? 'Modifier l\'idée' : 'Nouvelle idée'}</h3>
          
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full p-4 rounded-xl text-sm border flex items-center justify-between transition-all ${t.inputBg}`}
            >
              <div className="flex items-center gap-2">
                {React.createElement(THEMES.find(t => t.id === actForm.themeId)?.icon || HelpCircle, { className: "w-4 h-4" })}
                <span>{THEMES.find(th => th.id === actForm.themeId)?.name}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 ${t.cardBase} ${isDark ? 'bg-[#2D142C]' : 'bg-white'}`}>
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActForm({...actForm, themeId: theme.id});
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3 text-left text-sm flex items-center gap-2 transition-colors ${actForm.themeId === theme.id ? (isDark ? 'bg-purple-900/30' : 'bg-[#F0EBEF]') : 'hover:bg-black/5 dark:hover:bg-white/5'} ${t.textMain}`}
                  >
                    <theme.icon className="w-4 h-4" />
                    {theme.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <input 
            type="text" placeholder="Titre de l'activité" 
            value={actForm.title} onChange={(e) => setActForm({...actForm, title: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none ${t.inputBg}`}
          />
          <textarea 
            placeholder="Description courte..." rows="2"
            value={actForm.desc} onChange={(e) => setActForm({...actForm, desc: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none resize-none ${t.inputBg}`}
          />
          <textarea 
            placeholder="La petite phrase drôle (optionnel)..." rows="2"
            value={actForm.funny} onChange={(e) => setActForm({...actForm, funny: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none resize-none italic ${t.inputBg}`}
          />

          <div className="pt-2 flex gap-3">
            <button onClick={() => { setShowFormModal(false); setIsDropdownOpen(false); }} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Annuler
            </button>
            <button 
              onClick={handleSaveActivity} 
              disabled={!actForm.title || !actForm.desc} 
              className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${(!actForm.title || !actForm.desc) ? 'opacity-50 grayscale' : t.btnPrimary}`}
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmModal = () => {
    if (!activityToDelete) return null;
    return (
      <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble border-red-500/30 shadow-2xl shadow-red-900/20`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className={`text-2xl font-medium ${t.textMain}`}>Supprimer l'idée ?</h3>
            <p className={`${t.textMuted} text-sm mt-2 font-light`}>Êtes-vous sûr de vouloir supprimer <strong className={t.textMain}>"{activityToDelete.title}"</strong> de la liste ? Cette action est irréversible.</p>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button onClick={() => setActivityToDelete(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Garder
            </button>
            <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!activeDetail) return null;
    return (
      <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-5 rounded-[2rem] animate-bubble transition-colors duration-1000`}>
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <span className={`${t.accent} text-xs font-bold uppercase tracking-wider`}>Activité sélectionnée</span>
              <h3 className={`text-2xl font-medium ${t.textMain} mt-1 leading-tight`}>{activeDetail.title}</h3>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button 
                onClick={() => openEditModal(activeDetail)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-[#F0EBEF] text-[#756677] hover:text-[#593C60]'}`}
                title="Modifier"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActivityToDelete(activeDetail)}
                className="p-2 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className={`${t.textMain} opacity-90 font-light leading-relaxed`}>{activeDetail.description || activeDetail.desc}</p>
          
          {activeDetail.funny && (
            <div className={`p-4 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-white/10 border-white/20' : 'bg-[#F9F8F6] border-[#EAE5E0]'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${isDark ? 'bg-purple-400' : 'bg-[#8E6494]'}`}></div>
              <p className={`${t.accent} text-sm italic font-medium leading-relaxed pl-2`}>
                "{activeDetail.funny}"
              </p>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button onClick={() => setActiveDetail(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Fermer
            </button>
            <button onClick={confirmActivity} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${t.btnPrimary}`}>
              On le fait !
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderArchiveSuccessScreen = () => {
    if (!showArchiveSuccess) return null;
    return (
      <div className={`absolute inset-0 z-[100] ${isDark ? 'bg-purple-950/90' : 'bg-purple-50/90'} backdrop-blur-md flex flex-col items-center justify-center p-6 transition-colors duration-500`}>
        <div className="animate-victory-pop flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-white/10' : 'bg-white shadow-purple-200/50'}`}>
            <Archive className={`w-12 h-12 ${t.accent}`} />
          </div>
          <h2 className={`text-4xl amow-font ${t.textMain} mb-3`}>Souvenir classé !</h2>
          <div className={`${t.cardBase} p-4 rounded-2xl max-w-xs mt-2`}>
            <p className={`${t.textMuted} text-sm font-light leading-relaxed`}>
              Cette activité a bien été enregistrée. Retrouvez vos notes et commentaires à tout moment dans l'onglet <strong className={t.accent}>Nos Archives</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderVictoryScreen = () => {
    if (!showVictory) return null;
    return (
      <div className={`absolute inset-0 z-[100] ${isDark ? 'bg-[#1A0B1C]/95' : 'bg-white/95'} backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-colors duration-1000`}>
        <div className="animate-victory-pop flex flex-col items-center text-center">
          <div className="text-8xl mb-6 drop-shadow-xl">🎉</div>
          <h2 className={`text-5xl amow-font ${t.textMain} mb-2 transition-colors duration-1000`}>C'est parti !</h2>
          <p className={`${t.accent} text-lg font-light transition-colors duration-1000`}>Préparez-vous pour un super moment.</p>
        </div>
      </div>
    );
  };

  const renderCompletionModal = () => {
    if (!showCompletion) return null;
    return (
      <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-5 rounded-[2rem] animate-bubble transition-colors duration-1000`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3 shadow-inner">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h3 className={`text-2xl font-medium ${t.textMain} leading-tight`}>C'est dans la boîte !</h3>
            <p className={`${t.textMuted} text-sm mt-1 font-light`}>Comment s'est passée l'activité "{currentActivity?.title}" ?</p>
          </div>
          
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                <Star className={`w-8 h-8 transition-colors duration-300 ${rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Un petit mot pour la prochaine fois ? (Ex: Prévoir plus de fromage...)"
            className={`w-full p-4 rounded-2xl text-sm outline-none transition-all resize-none border ${t.inputBg}`}
            rows="3"
          />

          <div className="pt-2 flex gap-3">
            <button onClick={() => setShowCompletion(false)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Annuler
            </button>
            <button onClick={archiveActivity} disabled={rating === 0} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${rating === 0 ? 'opacity-50 grayscale cursor-not-allowed' : t.btnPrimary}`}>
              Archiver
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="dashboard-screen flex flex-col gap-4 h-full pt-2 animate-bubble overflow-y-auto pb-8 pr-1">
      {currentActivity && (
        <button 
          onClick={() => setShowCompletion(true)}
          className={`w-full flex-shrink-0 relative overflow-hidden rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 active:scale-95 transition-all text-left group border-2 border-dashed
            ${isDark ? 'bg-gradient-to-br from-yellow-600 via-amber-700 to-yellow-900 border-yellow-400/50 shadow-lg' 
                     : 'bg-gradient-to-br from-[#FFF3C7] via-[#FFD700] to-[#E5B80B] border-[#B8860B]/40 shadow-md'}`}
        >
          <div className="relative z-10 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className={`w-5 h-5 ${isDark ? 'text-yellow-300' : 'text-[#8B6508]'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-yellow-300' : 'text-[#8B6508]'}`}>Ticket d'Or • En cours</span>
            </div>
            
            <h3 className={`font-medium text-2xl leading-tight ${isDark ? 'text-white' : 'text-[#4A3800]'}`}>{currentActivity.title}</h3>
            <p className={`text-sm mt-1 font-light ${isDark ? 'text-yellow-100/80' : 'text-[#6B4E00]'}`}>{currentActivity.desc}</p>
            
            <div className={`mt-5 w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-inner border
              ${isDark ? 'bg-yellow-900/40 text-yellow-200 border-yellow-500/30 group-hover:bg-yellow-800/60' 
                       : 'bg-white/40 text-[#6B4E00] border-white/50 group-hover:bg-white/60'}`}>
              <Star className="w-4 h-4" /> Cliquer pour Noter & Archiver
            </div>
          </div>

          <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
        </button>
      )}

      <div className="dashboard-grid grid grid-cols-2 gap-4 mt-2">
        <button onClick={() => setCurrentView('browse')} className={`dashboard-card dashboard-card--full ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group col-span-2 active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '50ms' }}>
          <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">📚</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-xl transition-colors duration-700`}>Parcourir</h3>
            <p className={`${t.textMuted} text-sm mt-1 font-light transition-colors duration-700`}>Accès libre à toutes les idées</p>
          </div>
        </button>

        <button onClick={() => { setCurrentView('assisted'); setAsstCards([]); setAsstThemes([]); }} className={`dashboard-card ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '100ms' }}>
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🎲</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-lg transition-colors duration-700`}>L'Assistant</h3>
            <p className={`${t.textMuted} text-[10px] mt-1 uppercase tracking-wider transition-colors duration-700`}>Tirage au sort</p>
          </div>
        </button>

        <button onClick={() => { setCurrentView('blind'); setBlindStep(0); }} className={`dashboard-card ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '150ms' }}>
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🙈</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-lg transition-colors duration-700`}>Aveugle</h3>
            <p className={`${t.textMuted} text-[10px] mt-1 uppercase tracking-wider transition-colors duration-700`}>Pass & Play</p>
          </div>
        </button>

        <button 
  onClick={() => setCurrentView('archives')} 
  className={`dashboard-card dashboard-card--full ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group col-span-2 active:scale-95 transition-all duration-500 animate-deal opacity-90 rounded-[2.5rem]`} 
  style={{ animationDelay: '200ms' }}
>
  <div className="flex items-center justify-center gap-3">
    <div className="text-3xl drop-shadow-sm">🗃️</div>
    <h3 className={`${t.textMain} font-medium text-xl transition-colors duration-700`}>Nos Archives</h3>
  </div>
  <div className="text-center">
    <p className={`${t.textMuted} text-xs font-light tracking-wide transition-colors duration-700`}>Retrouvez vos souvenirs</p>
  </div>
</button>
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="flex flex-col h-full relative animate-bubble">
      
      <button 
        onClick={openAddModal}
        className={`absolute bottom-4 right-2 z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all ${t.btnPrimary}`}
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="flex space-x-2 overflow-x-auto pb-4 flex-shrink-0">
        {THEMES.map((theme, index) => {
          const Icon = theme.icon;
          const isActive = activeTab === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveTab(theme.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-full flex items-center gap-2 border transition-all duration-300 animate-deal ${isActive ? (isDark ? 'bg-white/20 border-white/30' : 'bg-white border-[#EAE5E0] shadow-sm') : 'bg-transparent border-transparent hover:bg-black/5'}`}
              style={{ animationDelay: `${index * 50}ms` }}
              >
              <div className={`p-1.5 rounded-full ${isActive ? (isDark ? 'bg-white/10' : 'bg-[#F9F8F6]') : 'bg-transparent'}`}>
                <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-white' : theme.colorLight.split(' ')[0]) : (isDark ? theme.colorDark : theme.colorLight)}`} />
              </div>
              <span className={`text-sm font-medium ${isActive ? t.textMain : t.textMuted}`}>{theme.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-24 pr-1">
        {activities.filter(a => a.themeId === activeTab).length === 0 ? (
          <div className="text-center mt-10 opacity-50">
            <p className={t.textMain}>Aucune idée ici.</p>
            <p className="text-sm">Ajoutez-en une !</p>
          </div>
        ) : (
          activities.filter(a => a.themeId === activeTab).map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              index={index} 
              onClick={() => setActiveDetail(activity)} 
            />
          ))
        )}
      </div>
    </div>
  );

  const renderShuffling = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-bubble">
      <div className="relative w-32 h-40">
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm animate-card-shuffle-1 flex items-center justify-center ${isDark ? 'bg-purple-500/20 border-purple-400/50' : 'bg-[#E5DFE6] border-[#D1C8D4] shadow-md'}`}>
          <HelpCircle className={`w-10 h-10 ${isDark ? 'text-white/50' : 'text-[#8E6494]'}`} />
        </div>
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm animate-card-shuffle-2 flex items-center justify-center ${isDark ? 'bg-[#4A2545]/50 border-purple-400/50' : 'bg-[#F0EBEF] border-[#D1C8D4] shadow-md'}`}>
          <HelpCircle className={`w-10 h-10 ${isDark ? 'text-white/50' : 'text-[#8E6494]'}`} />
        </div>
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-md animate-card-shuffle-3 flex items-center justify-center shadow-xl ${isDark ? 'bg-white/10 border-white/30' : 'bg-white border-[#EAE5E0]'}`}>
          <HelpCircle className={`w-12 h-12 animate-pulse ${t.accent}`} />
        </div>
      </div>
      <h2 className={`text-2xl font-light ${t.textMain} animate-pulse transition-colors duration-1000`}>Le destin travaille...</h2>
    </div>
  );

  const renderAssisted = () => {
    if (currentActivity) return renderDashboard();
    if (isShuffling) return renderShuffling();

    if (asstCards.length === 0) {
      return (
        <div className="flex flex-col h-full space-y-6 animate-bubble">
          <div className="text-center pt-2">
            <h2 className={`text-3xl amow-font ${t.textMain}`}>Moteur de Choix</h2>
            <p className={`${t.textMuted} text-sm mt-1 font-light`}>Sélectionne 3 thèmes d'inspiration</p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4 pr-1">
            {THEMES.map((theme, index) => {
              const isSelected = asstThemes.includes(theme.id);
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    if (asstThemes.includes(theme.id)) setAsstThemes(asstThemes.filter(id => id !== theme.id));
                    else if (asstThemes.length < 3) setAsstThemes([...asstThemes, theme.id]);
                  }}
                  className={`${t.cardBase} p-4 flex flex-col items-center justify-center gap-3 transition-all duration-500 animate-deal rounded-[2rem] ${isSelected ? (isDark ? 'ring-2 ring-purple-400 bg-purple-900/30 scale-105' : 'ring-2 ring-[#8E6494] bg-white scale-105 shadow-md') : 'hover:border-[#8E6494]'} ${asstThemes.length === 3 && !isSelected ? 'opacity-40 grayscale' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  disabled={asstThemes.length === 3 && !isSelected}
                >
                  <Icon className={`w-8 h-8 transition-colors duration-300 ${isSelected ? t.accent : (isDark ? theme.colorDark : theme.colorLight)}`} />
                  <span className={`${t.textMain} text-sm font-medium`}>{theme.name}</span>
                </button>
              )
            })}
          </div>

          <div className={`${t.cardBase} p-4 flex items-center justify-between mt-auto mb-4 rounded-[2rem]`}>
            <span className={`${t.textMain} text-sm font-medium`}>{asstThemes.length}/3 sélectionnés</span>
            <button 
              onClick={() => {
                startShuffling(() => {
                  const drawn = asstThemes.map(themeId => {
                    const available = activities.filter(a => a.themeId === themeId);
                    return available.length === 0 ? activities[0] : available[Math.floor(Math.random() * available.length)];
                  });
                  setAsstCards(drawn);
                });
              }}
              disabled={asstThemes.length !== 3}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${asstThemes.length === 3 ? t.btnPrimary : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'}`}
            >
              Tirer au sort
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-6 animate-bubble">
        <div className="text-center pt-2">
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Le Destin a choisi</h2>
          <p className={`${t.textMuted} text-sm mt-1 font-light`}>Lequel vous tente le plus ?</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {asstCards.map((activity, idx) => (
            <ActivityCard 
              key={idx} 
              activity={activity} 
              index={idx} 
              onClick={() => setActiveDetail(activity)} 
            />
          ))}
        </div>
      </div>
    );
  };

  const renderBlindMode = () => {
    if (currentActivity) return renderDashboard(); 
    if (isShuffling) return renderShuffling();

    if (blindStep === 0) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-bubble">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center border shadow-xl relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-[#EAE5E0]'}`}>
           <span className="text-5xl absolute animate-bounce">🙈</span>
        </div>
        <div>
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Double Aveugle</h2>
          <p className={`${t.textMuted} text-sm mt-3 font-light max-w-xs mx-auto leading-relaxed`}>Chacun choisit secrètement l'activité qui lui fait envie. Si c'est la même : c'est un Match !</p>
        </div>
        <button onClick={() => {
          startShuffling(() => {
            const shuffled = [...activities].sort(() => 0.5 - Math.random());
            setBlindSelection(shuffled.slice(0, 3));
            setBlindStep(1); setP1Choice(null); setP2Choice(null);
          });
        }} className={`px-8 py-4 w-full max-w-xs mt-8 rounded-2xl font-medium active:scale-95 transition-all ${t.btnPrimary}`}>
          Commencer le jeu
        </button>
      </div>
    );

    if (blindStep === 2) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-bubble">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse border ${isDark ? 'bg-purple-500/20 border-purple-400/40' : 'bg-[#F0EBEF] border-[#D1C8D4] shadow-inner'}`}>
           <Sparkles className={`w-12 h-12 ${t.accent}`} />
        </div>
        <div>
          <h2 className={`text-4xl amow-font ${t.textMain}`}>Choix validé</h2>
          <p className={`${t.textMuted} font-light mt-3 text-lg`}>Passe le téléphone à ta moitié !</p>
        </div>
        <button onClick={() => setBlindStep(3)} className={`px-10 py-4 rounded-2xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
          C'est à moi
        </button>
      </div>
    );

    if (blindStep === 4) {
      const isMatch = p1Choice === p2Choice;
      const matchedActivity = activities.find(a => a.id === p1Choice);
      
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-bubble">
          {isMatch ? (
            <>
              <div className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(142,100,148,0.4)]">🔥</div>
              <div>
                <h2 className="text-6xl amow-font text-transparent bg-clip-text bg-gradient-to-r from-[#8E6494] to-[#4A2545] py-2">MATCH !</h2>
                <div className={`${t.cardBase} mt-6 p-4 rounded-2xl`}>
                   <p className={`${t.textMain} mt-1 text-xl font-medium`}>{matchedActivity?.title}</p>
                </div>
              </div>
              <button onClick={() => setActiveDetail(matchedActivity)} className={`px-10 py-4 rounded-2xl font-medium active:scale-95 transition-all ${t.btnPrimary}`}>
                On le fait !
              </button>
            </>
          ) : (
            <>
               <div className="text-7xl opacity-50 grayscale transition-all duration-1000">💔</div>
              <div>
                <h2 className={`text-4xl amow-font ${t.textMain}`}>Aïe, pas de match !</h2>
                <p className={`${t.textMuted} mt-3 font-light`}>Les grands esprits ne se sont pas rencontrés cette fois.</p>
              </div>
              <button onClick={() => setBlindStep(0)} className={`px-8 py-4 mt-4 rounded-2xl font-medium active:scale-95 transition-all border ${t.btnSecondary}`}>
                Retenter la chance
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-6 animate-bubble">
        <div className="text-center pt-2">
          <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-4 animate-pulse ${isDark ? 'bg-purple-500/20 border-purple-400/30 text-purple-200' : 'bg-[#F0EBEF] border-[#D1C8D4] text-[#593C60]'}`}>
            Tour du Joueur {blindStep === 1 ? '1' : '2'}
          </span>
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Que veux-tu faire ?</h2>
        </div>

        <div className="flex-1 space-y-4 pr-1">
          {blindSelection.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              index={index} 
              onClick={() => {
                if (blindStep === 1) { setP1Choice(activity.id); setBlindStep(2); }
                else { setP2Choice(activity.id); setBlindStep(4); }
              }} 
            />
          ))}
        </div>
      </div>
    );
  };

  const renderArchives = () => (
  <div className="flex flex-col gap-4 h-full pt-2 animate-bubble overflow-y-auto pb-8 pr-1">
    {archives.length === 0 ? (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${t.textMuted}`}>
        <div className="text-5xl">🗃️</div>
        <p className="text-sm font-light">Aucun souvenir pour l'instant.</p>
      </div>
    ) : (
      archives.map((archive, index) => (
        <div key={archive.id} className={`${t.cardBase} p-5 rounded-2xl animate-deal relative`} style={{ animationDelay: `${index * 60}ms` }}>
  
  {/* Bouton suppression */}
  <button
    onClick={() => setArchiveToDelete(archive)}
    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
  >
    <Trash2 className="w-4 h-4" />
  </button>

  <div className="flex items-start justify-between pr-8">
    <h3 className={`${t.textMain} font-medium text-lg`}>{archive.activity_title}</h3>
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${archive.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      ))}
    </div>
  </div>
  {archive.comment && (
    <p className={`${t.textMuted} text-sm mt-2 font-light italic`}>"{archive.comment}"</p>
  )}
  <p className={`${t.textMuted} text-xs mt-3`}>
    {new Date(archive.archived_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
  </p>
</div>
      ))
    )}
  </div>
)

const renderDeleteArchiveModal = () => {
  if (!archiveToDelete) return null
  return (
    <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble border-red-500/30 shadow-2xl shadow-red-900/20`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className={`text-2xl font-medium ${t.textMain}`}>Supprimer ce souvenir ?</h3>
          <p className={`${t.textMuted} text-sm mt-2 font-light`}>
            <strong className={t.textMain}>"{archiveToDelete.activity_title}"</strong> sera définitivement effacé.
          </p>
        </div>
        <div className="pt-4 flex gap-3">
          <button onClick={() => setArchiveToDelete(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
            Garder
          </button>
          <button onClick={async () => {
            await supabase.from('archives').delete()
            .eq('id', archiveToDelete.id)
            .eq('user_id', currentUser?.id)
            setArchives(archives.filter(a => a.id !== archiveToDelete.id))
            setArchiveToDelete(null)
          }} className="flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

  const renderHeader = () => {
    const ThemeToggle = () => (
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border active:scale-95 z-20 ${isDark ? 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20' : 'bg-white border-[#EAE5E0] text-[#4A2545] shadow-sm hover:bg-[#F0EBEF]'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    );

    if (currentView === 'auth') return <ThemeToggle />;

    if (currentView === 'dashboard') {
      return (
        <header className="flex flex-col items-center justify-center p-6 pb-2 z-10 animate-in fade-in slide-in-from-top-4 relative">
          <ThemeToggle />
          <div className={`w-28 h-28 rounded-[2rem] overflow-hidden shadow-xl flex-shrink-0 relative group cursor-pointer hover:scale-105 transition-transform duration-500 border-4 ${isDark ? 'border-white/10 shadow-purple-900/20' : 'border-white shadow-purple-200/30 bg-white'}`}>
            <img src="logo.png" alt="AMOW Logo" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <h1 className="text-5xl amow-font mt-5 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] via-[#8E6494] to-[#593C60] drop-shadow-sm font-bold">
            AMOW
          </h1>

          <button
  onClick={() => { logout(); setCurrentView('auth'); }}
  className={`absolute left-6 top-6 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border active:scale-95 z-20 ${isDark ? 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20' : 'bg-white border-[#EAE5E0] text-[#756677] shadow-sm hover:bg-[#F0EBEF]'}`}
  title="Se déconnecter"
>
  <EyeOff className="w-5 h-5" />
</button>

        </header>
      );
    }

    return (
      <header className="flex items-center justify-center p-6 z-10 relative">
        <button 
          onClick={() => { setCurrentView('dashboard'); setBlindStep(0); }}
          className={`absolute left-6 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 border active:scale-95 ${t.btnSecondary}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="flex flex-col items-center">
          <h1 className="text-3xl amow-font text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] to-[#8E6494] font-bold">
            AMOW
          </h1>
          <span className={`${t.textMuted} text-[10px] font-bold uppercase tracking-widest mt-1`}>
            {currentView === 'browse' ? 'Catégories' : currentView === 'blind' ? 'Jouer' : currentView === 'archives' ? 'Nos Archives' : 'Assistant'}
          </span>
        </div>
      </header>
    );
  };

  return (
    <div className={`min-h-screen font-sans relative ${hasTailwindCdn ? '' : 'no-tailwind'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #000; }
        .amow-font { font-family: 'Dancing Script', cursive; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(142, 100, 148, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(142, 100, 148, 0.6); }
        * { scrollbar-width: thin; scrollbar-color: rgba(142, 100, 148, 0.3) transparent; }
        
        @keyframes bubbleExpand { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-bubble { animation: bubbleExpand 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        @keyframes dealCard { 0% { transform: translateY(-30px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-deal { animation: dealCard 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        
        @keyframes victoryPop { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-victory-pop { animation: victoryPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes shine { 100% { left: 200%; } }
        .animate-shine { animation: shine 3s infinite; }

        @keyframes cardShuffle1 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 10;} 50% { transform: translateX(-40px) rotate(-15deg) scale(0.9); z-index: 10;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 30;} }
        @keyframes cardShuffle2 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 20;} 50% { transform: translateX(40px) rotate(15deg) scale(0.9); z-index: 20;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 10;} }
        @keyframes cardShuffle3 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 30;} 50% { transform: translateX(0px) translateY(-20px) scale(1.1); z-index: 30;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 20;} }
        .animate-card-shuffle-1 { animation: cardShuffle1 0.6s infinite ease-in-out alternate; }
        .animate-card-shuffle-2 { animation: cardShuffle2 0.6s infinite ease-in-out alternate-reverse; }
        .animate-card-shuffle-3 { animation: cardShuffle3 0.6s infinite ease-in-out alternate; }



      `}} />

      <div className="fixed inset-0 bg-[#FBF9F6] z-0 transition-opacity duration-1000"></div>
      <div className={`fixed inset-0 bg-gradient-to-br from-[#1A0B1C] via-[#2D142C] to-[#3B1932] transition-opacity duration-1000 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}></div>

      {renderArchiveSuccessScreen()}
      {renderVictoryScreen()}
      {renderDeleteConfirmModal()}
      {renderFormModal()}
      {renderDeleteArchiveModal()}

      <div className="max-w-md mx-auto h-screen flex flex-col overflow-hidden relative z-10">
        {renderHeader()}
        <main className={`flex-1 overflow-hidden flex flex-col relative ${currentView !== 'auth' ? 'px-5 pb-6' : ''}`}>
          {currentView === 'auth' && renderAuth()}
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'browse' && renderBrowse()}
          {currentView === 'assisted' && renderAssisted()}
          {currentView === 'blind' && renderBlindMode()}
          {currentView === 'archives' && renderArchives()}
          {renderDetailModal()}
          {renderCompletionModal()}
        </main>
      </div>
    </div>
  );
}
