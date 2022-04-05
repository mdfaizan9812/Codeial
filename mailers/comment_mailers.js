const nodemailer = require('../config/nodemialer.js');


exports.newComment = (comment)=>{
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: 'faizanahmed@gmail.com', // sender address
        to: comment.user.email, // list of receivers
        subject: "New comment published", // Subject line
        html: htmlString, // html body
    },(err,info)=>{
        if(err){console.log('err in new comment',err); return}
        console.log('Message sent',info);
        return;
    })
}