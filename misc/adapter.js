// istyle dev config

jQuery.extend({
    istyle: {

        // development
        dev: {
            url: 'http://ws/istyle',
            dir: {
                // less:'d/less'
            }
        },

        // online
        uat: {
            url: 'http://cdataportal.sh.ctripcorp.com/istyle',
            dir: {
                
            }
        },

        // d 定制；1时默认选中    m 展示模块； i JS模块
        css: {
            conf: ['_variables'],
            base: ['_mixins'],
            reset: ['reset', 'type', 'grid'],
            mods: {
                'start':            { n:'开始使用！',           m:0 },
                'navbar':           { n:'导航',           d:1,  m:0 },
                'grid':             { n:'布局',                 m:0 },
                'type':             { n:'基础样式',             m:0 },
                'button':           { n:'按钮',           d:1,  m:0 },
                'form':             { n:'表单',           d:1,  m:0 },
                'sprite':           { n:'图标',           d:1,  m:0 },
                'label':            { n:'标签',           d:1,  m:0 },
                'table':            { n:'表格',           d:1,  m:0 },
                'nav':              { n:'菜单',           d:1,  m:0 },
                'media':            { n:'模块展示',       d:0,  m:0 },
                'loading':          { n:'Loading',              m:0,  i:'JS' },
                'tab':              { n:'选项卡',               m:0,  i:'JS' },
                'tooltip':          { n:'提示信息',       d:0,  m:0,  i:'JS' },
                'popover':          { n:'浮出层',         d:0,  m:0,  i:'JS' },
                'modal':            { n:'弹出层',         d:0,  m:0,  i:'JS' },
                'dropdown':         { n:'下拉菜单',       d:0,  m:0,  i:'JS' },
                'prettify':         { n:'代码高亮',       d:0,  m:0,  i:'JS' },
                'calendar':         { n:'日历',           d:0,  m:0,  i:'JS' },
                'querypage':        { n:'携程页面选择',   d:1,  m:0,  i:'JS' },
                'pagination':       { n:'分页',           d:0,  m:0 },
                'alert':            { n:'警告',           d:0,  m:0 },
                'carousel':         { n:'轮换图',         d:0 },
                'responsive':       { n:'自适应布局',     d:0 },
                'breadcrumb':       { n:'面包屑导航',           m:0 },
                'other':            { n:'其它',                 m:0 }
            },
            vers: {
                '-30626': '新增：携程页面选择控件',
                '-30517': '新增：表格排序；修改：日历控件，表格th；',
                '-30507': '新增：代码高亮部件',
                '-30418': '完善部件',
                '-30401': '来啦'
            }
        },

        js: {
            mods: {
                'transition':       {n:'动画',                            d:1},
                'modal':            {n:'弹出层',                          d:1},
                'dropdown':         {n:'下拉菜单',                        d:1},
                'tab':              {n:'选项卡',                          d:1},
                'tooltip':          {n:'提示信息',                        d:1},
                'popover':          {n:'浮出层 (需要选择：提示信息)',     d:1},
                'prettify':         {n:'代码高亮',                        d:0},
                'loading':          {n:'Loading',                         d:0},
                'alert':            {n:'警告',                            d:0},
                'calendar':         {n:'日历',                            d:0},
                'querypage':        {n:'携程页面选择',                    d:1},
                'tablesorter':      {n:'表格排序',                        d:0},
                'scrollspy':        {n:'滚动定位',                        d:0},
                'affix':            {n:'固定',                            d:0},
                'button':           {n:'按钮',                            d:0},
                'collapse':         {n:'Collapse',                        d:0},
                'carousel':         {n:'轮换展示',                        d:0},
                'typeahead':        {n:'预先输入',                        d:0}
            },
            vers: {
                '-30626': '新增：携程页面选择控件',
                '-30517': '新增：日历JS控件，Loading部件，表格排序控件',
                '-30507': '新增：代码高亮部件',
                '-30418': '完善部件'
            }
        },

        // default directory
        dir: {
            less: 'less',
            css: 'css',
            js: 'js',
            misc: 'misc',
            code: 'code',
            modules: 'modules',
            img: 'img',
            g: 'g',
            gcode: 'gcode'
        },

        _urlCash: {},

        // get url
        url: function(param){
            if( this._urlCash[param] ) 
                return this._urlCash[param]

            var dirtemp = null;
            if( !param )
                return this.isdev() ? this.dev.url : this.uat.url
            

            if( param==='HTTP' ){
                if( this.isdev() ){
                    return this.dev.url.split('/istyle')[0];
                }else{
                    return this.uat.url.split('/istyle')[0];
                }
            }

            var alldir='';
            for( var key in this.dir ){
                alldir += key+'*';
            }
            alldir = alldir.split('*');
            alldir.pop();

            if( $.inArray(param,alldir)=='-1' ){
                return;
            }else{
                if( this.isdev() ){
                    var temp = this.dev.dir[param];
                    if( !temp ){
                        dirtemp = this.dev.url+'/'+this.dir[param];
                    }else{
                        if( !/^http:\/\/*/.exec(temp) ){
                            dirtemp = this.dev.url+'/'+temp;
                        }else{
                            dirtemp = temp;
                        }
                    }
                }else{
                    var temp = this.uat.dir[param];
                    if( !temp ){
                        dirtemp = this.uat.url+'/'+this.dir[param];
                    }else{
                        if( !/^http:\/\/*/.exec(temp) ){
                            dirtemp = this.uat.url+'/'+temp;
                        }else{
                            dirtemp = temp;
                        }
                    }
                }
            }

            this._urlCash[param] = dirtemp;
            return dirtemp;
        },

        // judge environment
        isdev: function(){
            return document.URL.indexOf(this.dev.url)>=0 ? true : false
        }
    }
});

// console.log($.istyle.url2.js);
// console.log($.istyle.url('HTTP'));
// console.log($.istyle.css('conf').join());
// console.log($.istyle.css.conf);


;(function($){

    var files = '';

    // dev
    // use .less and .js modules
    if( $.istyle.isdev() ){
        console.log('development:  less => '+$.istyle.url('less')+'    js => '+$.istyle.url('js'));

        // analysis .less files
        less = {
            env: "development", 
            async: false,       
            fileAsync: false,           
            poll: 1000,         
            functions: {},      
            dumpLineNumbers: "comments", 
            relativeUrls: false
        }

        files += '<link rel="stylesheet/less" href="'+$.istyle.url('less')+'/_index.less">';

        files += '<script src="'+$.istyle.url('misc')+'/less.js"></script>';

        for( var key in $.istyle.js.mods ){
            if( typeof $.istyle.js.mods[key] === 'function' ) return 
            files += '<script src="'+$.istyle.url('js')+'/'+key+'.js"></script>';
        }

    }

    // online
    // use latest version istyle.css and istyle.js
    else{
        files += '<link rel="stylesheet" href="'+$.istyle.url('code')+'/istyle.css">';
        files += '<script src="'+$.istyle.url('code')+'/istyle.js"></script>';
    };

    $('title:first').after(files);

})(jQuery);