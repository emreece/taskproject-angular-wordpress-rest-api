# Task Management Angular and Wordpress Rest API Project
This project is making a task management. Backend is using Wordpress Rest API

## Requirements
- Wordpress Installation and Actived Wordpress API. It is active at default Wordpress installation

- JWT Authentication for WP-API plugin and custom post type registration.

- Register task post type to your Wordpress. You can add these codes to your active theme's functions.php file.

        function cptui_register_my_cpts_task() {

        /**
        * Post Type: Tasks.
        */

        $labels = [
            "name" => __( "Tasks", "taskproject" ),
            "singular_name" => __( "Task", "taskproject" ),
        ];

        $args = [
            "label" => __( "Tasks", "taskproject" ),
            "labels" => $labels,
            "description" => "",
            "public" => true,
            "publicly_queryable" => true,
            "show_ui" => true,
            "show_in_rest" => true,
            "rest_base" => "",
            "rest_controller_class" => "WP_REST_Posts_Controller",
            "has_archive" => false,
            "show_in_menu" => true,
            "show_in_nav_menus" => true,
            "delete_with_user" => false,
            "exclude_from_search" => false,
            "capability_type" => "post",
            "map_meta_cap" => true,
            "hierarchical" => false,
            "rewrite" => [ "slug" => "task", "with_front" => true ],
            "query_var" => true,
            "supports" => [ "title", "editor", "thumbnail", "excerpt", "custom-fields", "author" ],
            "taxonomies" => [ "category" ],
        ];

        register_post_type( "task", $args );
        }
        add_action( 'init', 'cptui_register_my_cpts_task' );

## Installation

- Install modules with "npm install"
- Set your api settings with enviroment file. You need to set just apiUrl parameter.
- You can prevent to read other's tasks with below code. You shoud add these codes to your active theme's functions.php.

        function posts_for_current_author($query) {
            global $pagenow;
        
            /* if( 'edit.php' != $pagenow || !$query->is_admin )
                return $query; */
        
            if( !current_user_can( 'edit_others_posts' ) ) {
                global $user_ID;
                $query->set('author', $user_ID );
            }
            return $query;
        }
        add_filter('pre_get_posts', 'posts_for_current_author');