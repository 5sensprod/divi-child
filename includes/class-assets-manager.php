<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_Assets_Manager
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'), 20);
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'), 20);
    }

    public function enqueue_styles()
    {
        // Parent theme style
        wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');

        // Child theme style avec version pour éviter le cache
        wp_enqueue_style(
            'child-style',
            get_stylesheet_directory_uri() . '/style.css',
            array('parent-style'),
            filemtime(get_stylesheet_directory() . '/style.css'),
            'all'
        );

        // SVG Themes CSS
        wp_enqueue_style(
            'axe-svg-themes',
            get_stylesheet_directory_uri() . '/assets/css/_svg-themes.css',
            array('child-style'),
            filemtime(get_stylesheet_directory() . '/assets/css/_svg-themes.css'),
            'all'
        );
    }

    public function enqueue_scripts()
    {
        // Script des blobs particules
        wp_enqueue_script(
            'axe-particle-blobs',
            get_stylesheet_directory_uri() . '/assets/js/particle-blobs.js',
            array(),
            filemtime(get_stylesheet_directory() . '/assets/js/particle-blobs.js'),
            true
        );

        wp_enqueue_script(
            'axe-svg-background',
            get_stylesheet_directory_uri() . '/assets/js/axe-svg-background.js',
            array(),
            filemtime(get_stylesheet_directory() . '/assets/js/axe-svg-background.js'),
            true
        );
    }
}
