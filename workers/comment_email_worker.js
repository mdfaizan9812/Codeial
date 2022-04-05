const queue = require('../config/kue.js');
const commentsMailer = require('../mailers/comment_mailers.js');

queue.process('emails',function(job,done){ // emails is customize name we can give any name to identify the worker
    console.log('Email worker is processing a job',job.data) // job is nothhing but coming comment

    // calling newComment function to mail respective user
    commentsMailer.newComment(job.data);
    done();
})