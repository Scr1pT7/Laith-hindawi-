// Node/Express backend for comments + contact
const express = require('express'); const cors = require('cors'); const fs = require('fs'); const path = require('path'); const axios = require('axios'); const nodemailer = require('nodemailer');
const app = express(); app.use(cors()); app.use(express.json()); const PORT = process.env.PORT || 3000;

// Data store
const DATA_DIR = path.join(__dirname); const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
if(!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, JSON.stringify({comments:[]}, null, 2));

// ---- Comments API ----
app.get('/api/comments', (req,res)=>{ try{ const data = JSON.parse(fs.readFileSync(COMMENTS_FILE,'utf-8')); res.json({success:true, comments: data.comments || []}); }catch(e){ res.json({success:true, comments:[]}); } });
app.post('/api/comments', (req,res)=>{ const {name, role, text} = req.body || {}; if(!name || !text) return res.status(400).json({success:false, error:'Missing name or text'}); try{ const data = JSON.parse(fs.readFileSync(COMMENTS_FILE,'utf-8')); data.comments = data.comments || []; data.comments.unshift({ name, role, text, ts: Date.now() }); fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2)); res.json({success:true}); }catch(e){ res.status(500).json({success:false, error:'Server error'}); } });

// ---- Contact (same as v4 simplified) ----
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || ''; const SEND_EMAILS = false;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com'; const SMTP_USER = process.env.SMTP_USER || 'user@example.com'; const SMTP_PASS = process.env.SMTP_PASS || 'password'; const TO_EMAIL = process.env.TO_EMAIL || 'you@example.com';
let transporter = null; if(SEND_EMAILS){ transporter = nodemailer.createTransport({host:SMTP_HOST,port:587,secure:false,auth:{user:SMTP_USER,pass:SMTP_PASS}}); }
app.post('/api/contact', async (req,res)=>{ const {name,email,message,recaptcha_token}=req.body||{}; if(!name||!email||!message) return res.status(400).json({success:false,error:'Missing fields.'});
  if(RECAPTCHA_SECRET){ try{ const verify=await axios.post('https://www.google.com/recaptcha/api/siteverify',null,{params:{secret:RECAPTCHA_SECRET,response:recaptcha_token}}); if(!verify.data.success) return res.status(400).json({success:false,error:'reCAPTCHA failed.'}); }catch(e){ return res.status(400).json({success:false,error:'reCAPTCHA error.'}); } }
  fs.appendFileSync(path.join(DATA_DIR,'messages.log'), JSON.stringify({ts:new Date().toISOString(),name,email,message})+'\n');
  if(SEND_EMAILS && transporter){ try{ await transporter.sendMail({from:SMTP_USER,to:TO_EMAIL,subject:'New portfolio contact',text:`From: ${name} <${email}>\n\n${message}`}); }catch(e){} }
  res.json({success:true});
});

app.listen(PORT, ()=>console.log('Server listening on http://localhost:'+PORT));
