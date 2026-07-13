const https=require('https');
exports.handler=async function(event){
  const key=process.env.ONESIGNAL_REST_KEY;
  const appId='a552567f-17e6-4c2f-9cd8-1d3d3c00dae6';
  const body=event.body?JSON.parse(event.body):{};
  const message=body.message||'Check your Command Center';
  const payload=JSON.stringify({
    app_id:appId,
    included_segments:['All'],
    contents:{en:message},
    headings:{en:'Command Center'},
  });
  return new Promise((resolve)=>{
    const req=https.request({
      hostname:'onesignal.com',
      path:'/api/v1/notifications',
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Basic '+key},
    },(res)=>{
      let data='';
      res.on('data',chunk=>data+=chunk);
      res.on('end',()=>resolve({statusCode:200,body:data}));
    });
    req.on('error',e=>resolve({statusCode:500,body:e.message}));
    req.write(payload);
    req.end();
  });
};