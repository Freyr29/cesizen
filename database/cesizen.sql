-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 21 avr. 2025 à 14:26
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cesizen`
--

-- --------------------------------------------------------

--
-- Structure de la table `activities`
--

CREATE TABLE `activities` (
  `id` int(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activities`
--

INSERT INTO `activities` (`id`, `title`, `description`, `duration`, `difficulty`, `active`, `created_at`) VALUES
(1, 'le test', 'ceci est un test', 2, 'easy', 0, '2025-03-22 20:39:31'),
(2, 'Méditation guidée', 'Une séance de méditation pour apaiser votre esprit', 10, 'easy', 1, '2025-03-23 14:16:51'),
(3, 'Yoga doux', 'Des postures simples pour détendre votre corps', 15, 'easy', 1, '2025-03-23 14:16:51'),
(4, 'Marche consciente', 'Une promenade méditative en pleine conscience', 20, 'easy', 1, '2025-03-23 14:16:51'),
(5, 'Exercices de respiration', 'Techniques de respiration pour la relaxation', 5, 'easy', 1, '2025-03-23 14:16:51'),
(6, 'Étirements doux', 'Une série d\'étirements pour relâcher les tensions', 12, 'easy', 1, '2025-03-23 14:16:51'),
(7, 'Visualisation positive', 'Un exercice de visualisation pour réduire le stress', 15, 'medium', 1, '2025-03-23 14:16:51'),
(8, 'dfgfg', 'fdhf', 5, 'easy', 0, '2025-04-05 13:45:06'),
(9, 'hfhftg', 'ftt', 5, 'easy', 0, '2025-04-05 14:07:48');

-- --------------------------------------------------------

--
-- Structure de la table `informations`
--

CREATE TABLE `informations` (
  `id` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `category` enum('Stress','Bien-être','Dépression','Sommeil','Activité physique','Anxiété') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `informations`
--

INSERT INTO `informations` (`id`, `title`, `description`, `url`, `source`, `category`, `active`) VALUES
(1, 'Comprendre et gérer le stress au quotidien', 'Un guide complet sur les mécanismes du stress et les stratégies pour mieux le gérer dans la vie de tous les jours.', 'https://www.santementale.fr/stress-et-anxiete/', 'Santé Mentale France', 'Stress', 1),
(2, 'Les bienfaits de la méditation sur la santé mentale', 'Découvrez comment la méditation peut améliorer votre bien-être mental et réduire l\'anxiété.', 'https://www.passeportsante.net/fr/Therapies/Guide/Fiche.aspx?doc=meditation_th', 'Passeport Santé', 'Bien-être', 1),
(3, 'Dépression : symptômes, causes et traitements', 'Un article détaillé sur la dépression, ses manifestations et les différentes approches thérapeutiques disponibles.', 'https://www.inserm.fr/dossier/depression/', 'INSERM', 'Dépression', 1),
(4, 'L\'importance du sommeil pour la santé mentale', 'Comment un bon sommeil contribue à maintenir une bonne santé mentale et les conseils pour mieux dormir.', 'https://www.institut-sommeil-vigilance.org/', 'Institut National du Sommeil', 'Sommeil', 1),
(5, 'Exercice physique et santé mentale', 'Les effets positifs de l\'activité physique sur le bien-être mental et la réduction du stress.', 'https://www.who.int/fr/news-room/fact-sheets/detail/physical-activity', 'OMS', 'Activité physique', 1),
(6, 'Anxiété sociale : la comprendre et la surmonter', 'Des stratégies pratiques pour faire face à l\'anxiété sociale et améliorer ses interactions sociales.', 'https://www.anxiete.fr/trouble-anxieux/anxiete-sociale/', 'Anxiété.fr', 'Anxiété', 1),
(26, 'rsthrtsg', 'fdgbf', 'https://www.youtube.com/', 'fgfdg', 'Dépression', 0);

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

CREATE TABLE `session` (
  `userId` int(11) NOT NULL,
  `sessionToken` varchar(255) NOT NULL,
  `expireAt` bigint(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `userId` int(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Utilisateur','Administrateur') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `nom`, `mail`, `password`, `role`, `active`) VALUES
(6, 'Nathan', 'nathan.toupin29@gmail.com', '$2b$10$u6Kf.H3XRcflqxyEwyucG.TId8Wg9mTT9oNr8rgWS8xR4VRNIbgmu', 'Administrateur', 1),
(10, 'user', 'user.test@gmail.com', '$2b$12$2u9xFcurlT/a09MJ8HrtyuXteP.fs/m9P.4b0fgU3An1b/4XmOdHq', 'Utilisateur', 1),
(11, 'adminsys', 'adminsys@gmail.com', '$2b$12$mDSZ2OHp2qeL73UnFsWlJuYWJwAqMhB2tsaMAF0sj5mX6STGpeLBm', 'Administrateur', 1),
(12, 'test', 'test@gmail.com', '$2b$12$W9HXJsC94pnegzYCvdguWO7gzQ.fc/bnPybIPh0hIuSJUHc4JvDIW', 'Utilisateur', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `informations`
--
ALTER TABLE `informations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `session`
--
ALTER TABLE `session`
  ADD KEY `fk_userId` (`userId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(36) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `informations`
--
ALTER TABLE `informations`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
