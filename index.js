const Crawler = require("crawler");
const fs = require('fs');

let urls={};
const c = new Crawler({
    maxConnections : 10,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log('222222222222222222');
            const uri = res.options.uri;
            const domain = res.options.domain;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            let $a = $('a','body');
            let arr = [];
            for(let i =0; i<$a.length;i++){
                const $_a = $a.eq(i);
                let href = $_a.attr('href');
                let text = $_a.text();
                href = href?href.trim():'';
                text = text?text.replace(/\s/g,''):'';
                if(!href || !text || href==='/')continue;
                if(/^http/.test(href)){
                    if(!href.startsWith(domain)){
                        continue;
                    }
                }
                if(/^\?/.test(href))continue;
                if(/^javascript/.test(href))continue;
                if(!/^http/.test(href)){
                    if(href.startsWith('/')){
                        href=`${domain}${href}`;
                    }else {
                        href=`${domain}/${href}`;
                    }
                }
                arr.push({uri:href,title:text,domain});
            }
            // console.log(`$a:${$a.length}`);
            console.log(`arr:${arr.length}`);
            fsWrite(arr);
            console.log('222222222222222222');
            // setTimeout(()=>{
            //     arr.forEach(ar=>{
            //         queue({
            //             title:ar.title,
            //             uri:ar.uri,
            //             domain:domain,
            //         })
            //     });
            // },1000)
        }
        done();
    }
});

// Queue just one URL, with default callback
function queue({title,uri,keyword,domain}){
    if(urls[uri])return;
    const Url = new URL(uri);
    if(!title)title=Url.hostname;
    // if(!keyword)keyword=Url.hostname.match(/^\w+?\.(\w+)\.\w+$/)[1];
    if(!domain)domain=Url.origin;
    urls[uri]={title,uri};
    console.log(uri,title,domain)
    c.queue({
        uri,
        title,
        domain,
    });
    fsWrite();
}
function fsWrite(arr=urls){
    let str = '';
    Object.values(arr).forEach(ar=>{
        str+=`${ar.title} ${ar.uri}\n`;
    });
    fs.writeFileSync('a.text',str);
    // console.log(`arr的length:${Object.keys(arr).length}`)
}
queue({
    uri:'https://www.bannedbook.org'
});
