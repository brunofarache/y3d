window.YUI_config = {
    groups: {
        y3d: {
            base: location.origin + '/y3d/build/',
            combine: false,
            modules: @MODULES@
       }
    }
};