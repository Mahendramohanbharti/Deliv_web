var express=require('express');
var router= express.Router();

//Get Category model

var Category =require('../models/category');
/* 
Get Category Index
*/

router.get('/',function(req,res){
    

    Category.find(function(err,categories){
        if(err) return console.log(err);

        res.render('admin/categories', {
            categories: categories
        });
    });
});

/* 
Get add category
*/

router.get('/add-category',function(req,res){
    var title="";
    

    res.render('admin/add-category',{
            title:title,
           
    });
});

/* 
Post add category
*/

router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add-category', {
            errors: errors,
            title: title
        });
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add-category', {
                    title: title
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                    // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         req.app.locals.pages = pages;
                    //     }
                    // });

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
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
 * GET edit category
 */
router.get('/edit-category/:id', (req, res) =>{

    Category.findById(req.params.id,(err, category) =>{
        if (err)
            return console.log(err);

        res.render('admin/edit-category', {
            title: category.title,
            
            id: category._id
        });
    });

});

/* 
Post edit Category
*/

router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    
    var id=req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit-category', {
            errors: errors,
            title: title,
            
            id:id
        });
    } else {
        Category.findOne({slug: slug, _id:{'$ne': id}}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit-category', {
                    title: title,
                    
                    id:id
                });
            } else {
                
                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);

                    category.title = title;
                    category.slug = slug;
                    
                    category.save(function (err) {
                        if (err)
                            return console.log(err);
    
                        // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.app.locals.pages = pages;
                        //     }
                        // });
    
                        req.flash('success', 'Category added!');
                        res.redirect('/admin/categories/edit-category/'+id);
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