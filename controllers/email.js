
const nodemailer = require('nodemailer');
const Email = require('../models/email');

const Template = require('../models/template');
const SmtpConfig = require('../models/smtpConfig');

async function ProcessingEmail(req, res) {

  const params = req.body;
  let smtp = {};
  smtp = await getSmtp();
  
  if(!smtp){
    res.status(404).send({message: 'no se encontró una configuración para smtp.'})
  }
  else if(smtp && smtp.error){
    res.status(500).send({...smtp, friendlyMessage: 'Error al intentar obtener la configuración del smtp.'})
  }
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure, // true for 465, false for other ports
    auth: {
      smtp: smtp.smtp, // generated ethereal smtp
      pass: smtp.pass // generated ethereal password
    }
  });

  let data = {
    from: params.from,//'"Felipe 👻" <felipe.serrano.cordova@gmail.com>', // sender address
    to: params.to, //"pipe.bf@gmail.com", // list of receivers
    cc: params.cc, //Comma separated list or an array of recipients email addresses that will appear on the Cc: field
    bcc: params.bcc, //Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
    subject: params.subject, // Subject line
    text: params.message, // plain text body
    html: "", // html body
    attachments: {}  //An array of attachment objects
  }

  if(params.isHtmlTemplate){ 
    let template = await getTemplate(params.templateName);

    if(!template){
      res.status(404).send({message: `no se encontró una plantilla con el nombre ${params.templateName}`})
    }
    else if(template && template.error){
      res.status(500).send({...template, friendlyMessage: 'Error al intentar obtener la plantilla de correo.'})
    }

    data.html = generateEmail(template, tags);
    data.attachments = {...params.attachments, ...template.embebedContent}
  }  

  const emailObj = {
    isHtmlTemplate, 
    date: new Date(), 
    templateName,
    body: template,
    userId: params.user,
    data
  }
  
  const rensultEmailSent = await sendEmail(transporter, emailObj);

  if(rensultEmailSent && rensultEmailSent.error){
    res.status(500).send({...rensultEmailSent, friendlyMessage: 'Error al intentar obtener la plantilla de correo.'})
  }
  else{
    res.status(200).send(rensultEmailSent);
  }
}

async function sendEmail(transporter, emailObj){
  try{
    const infoEmail = await transporter.sendMail(emailObj.data);
    const infoEmailStored = await createEmail(emailObj, infoEmail);
    const infoEmailStoredMessage = "";
    const status = 0;

    if(infoEmailStored && infoEmailStored.error){
      infoEmailStoredMessage = 'Error al intentar guardar el registro.';
      status = 500;
    }
    else{
      infoEmailStoredMessage = 'Registro almacenado con éxito.';
      status = 200;
    }

   return {
     infoEmail, 
     infoStored: {
       infoEmailStored, 
       status
      }
    }
  }catch(e){
    return {...e, error:true};
  }
}

async function getSmtp(){
  const configId = "5eb4d1ca183d513d10f7e53d";

  try{
    const smtp = await SmtpConfig.findById(configId).exec();
   return smtp;
  }catch(e){
    return {...e,error:true};
  }
}

async function getTemplate(templateName){
  
  try{
    const template = await Template.find({name: templateName}).exec();
    return template;
  }catch(e){
    return {...e,error:true};
  }
}

async function createEmail(obj, infoEmailSent){

  try{
    const email = new Email();    
    email.from = obj.data.from;
    email.to = obj.data.to;
    email.cc = obj.data.cc;
    email.bcc = obj.data.bcc;
    email.subject = obj.data.subject;
    email.message = obj.data.message;
    email.isHtmlTemplate = obj.isHtmlTemplate;
    email.attachments = obj.data.attachments;
    email.date = obj.date;
    email.status = infoEmailSent.status;
    email.messageId = infoEmailSent.messageId;
    email.log = infoEmailSent.log;
    email.templateName = obj.templateName;
    email.body = obj.body;
    email.user = obj.userId;

    const resultEmailStored = await email.save();
    return resultEmailStored;

  }catch(e){
    return {...e, error:true};
  }
    

}

async function generateEmail(template, tags){  
    const body = template.body;

    tags.forEach(item => {
      body = body.replace(item.key, item.value);      
    });

}
  
async function test(req, res){
    let smtp = {}
    smtp = await getSmtp();
    if(!smtp){
      res.status(404).send({message: 'no existe configuración smtp'})      
    }
    else if(smtp && smtp.error){
      res.status(500).send({...smtp, friendlyMessage: 'Error al intentar obtener'})
    }
    else{
      console.log(smtp);
      res.send(smtp);
    }
} 
  
module.exports = {
  ProcessingEmail,
  test
};