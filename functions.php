<?php

/**
 * Functions.php - Divi Child AXE MUSIQUE
 * 
 * @package AXE_MUSIQUE
 * @version 2.0.0
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

// ========================================
// 🔧 CONSTANTES
// ========================================

define('AXE_THEME_VERSION', '2.0.0');
define('AXE_THEME_DIR', get_stylesheet_directory());
define('AXE_THEME_URL', get_stylesheet_directory_uri());

// ========================================
// 📁 CHARGEMENT DES MODULES
// ========================================

require_once AXE_THEME_DIR . '/includes/class-assets-manager.php';
require_once AXE_THEME_DIR . '/includes/class-logo-manager.php';
require_once AXE_THEME_DIR . '/includes/class-shortcodes.php';
require_once AXE_THEME_DIR . '/includes/class-particle-card.php';

// ========================================
// 🚀 INITIALISATION
// ========================================

function axemusique_init()
{
    new AXE_Assets_Manager();
    new AXE_Logo_Manager();
    new AXE_Shortcodes();
    new AXE_Particle_Card();
}
add_action('after_setup_theme', 'axemusique_init');

// ========================================
// 🎨 SUPPORT THÈME
// ========================================

add_theme_support('post-thumbnails');
add_theme_support('menus');

// ========================================
// 🏷️ BODY CLASSES
// ========================================

function axemusique_body_classes($classes)
{
    $classes[] = 'axemusique-theme';
    return $classes;
}
add_filter('body_class', 'axemusique_body_classes');

// ========================================
// ⚡ OPTIMISATIONS
// ========================================

function axemusique_cleanup()
{
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'axemusique_cleanup');
