<?php
if (!defined('ABSPATH')) {
    exit;
}

class AXE_Assets_Manager
{

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'), 20);
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
    }
}
