var express=require('express');
var router= express.Router();

//Get Page model

var Page =require('../models/page');
/* 
Get Pages Index
*/

router.get('/',function(req,res){
    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages
        });
    });
});

/* 
Get add page
*/

router.get('/add-page',function(req,res){
    var title="";
    var slug="";
    var content="";

    res.render('admin/add-page',{
            title:title,
            slug:slug,
            content:content
    });
});

/* 
Post add page
*/

router.post('/add-page', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add-page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({slug: slug}, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add-page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save(function (err) {
                    if (err)
                        return console.log(err);

                    // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         req.app.locals.pages = pages;
                    //     }
                    // });

                    req.flash('success', 'Page added!');
                    res.redirect('/admin/pages');
                });
            }
        });
    }

});
// router.post('/add-page',[
//     check('title','Title must have a value').isLength({min:1}),
//     check('content','Content must have a value').isLength({min:1})
// ],(req,res)=>{
//     var title = req.body.title;
//     var content = req.body.content;
//     var slug = req.body.slug.replace(' ','-').toLowerCase();
//     if(slug == "") slug=title.replace(' ','-').toLowerCase();

//     errors = validationResult(req);
//     if(!errors.isEmpty()){
//         console.log(errors.array());
//         res.render('admin/add_page',{
//             errors: errors.array(),
//             title: title,
//             slug: slug,
//             content: content
//         });
//     }else{
//         console.log('success');
//     }  
// });

/*
 * POST reorder pages
 */
router.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    var count=0;

    for(var i=0;i<ids.length;i++){
        var id=ids[i];
        count++;

        (function(count){
            Page.findById(id,function(err,page){
                page.sorting=count;
                page.save(function(err){
                    if(err)
                        return console.log(err);
                })
            })
        })(count);
    }

});

/*
 * GET edit page
 */
router.get('/edit-page/:id', (req, res) =>{

    Page.findById(req.params.id,(err, page) =>{
        if (err)
            return console.log(err);

        res.render('admin/edit-page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });

});

/* 
Post edit page
*/

router.post('/edit-page/:slug', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id=req.body.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit-page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id
        });
    } else {
        Page.findOne({slug: slug, _id:{'$ne': id}}, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/edit-page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id:id
                });
            } else {
                
                Page.findById(id, function (err, page) {
                    if (err)
                        return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    page.save(function (err) {
                        if (err)
                            return console.log(err);
    
                        // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.app.locals.pages = pages;
                        //     }
                        // });
    
                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages/edit-page/'+id);
                    });
                });

               
            }
        });
    }

});

/* 
Get Delete Page
*/

router.get('/delete-page/:id',function(req,res){
    Page.findByIdAndRemove(req.params.id,function(err){
        if(err) return console.log(err);

        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages/');

    })
    
});

//Exports

module.exports=router