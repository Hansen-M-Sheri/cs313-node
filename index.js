const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/getRate', calculatePostage)
  //Direct all content to form.html at localhost:5000
  .get('/*', (req, res)=> {
  	res.sendFile(__dirname + '/public/form.html')
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function calculatePostage(req, res) {
	var oz = Number(req.query.weightOZ);
	var mailType = req.query.mailType;

	calculateRate(res, oz, mailType);
	
}

function calculateRate(res, oz, type){
	let rate = 0;
	let error = "";
	//calculate rate
	if(type == "Letter (Stamped)"){
		if(oz > 0 && oz <= 1){
			rate = 0.55;
		}
		else if(oz > 1 && oz <= 2 ){
			rate = 0.70;
		}
		else if(oz > 2 && oz <= 3.5){
			rate = 1.00;
		}
		else{
			error = "Letters (stamped) can not weigh over 3.5 oz";
			console.log(error);
		}
	}
	else if (type == "Letters (Metered)"){
		if(oz > 0 && oz <= 1){
			rate = 0.50;
		}
		else if(oz > 1 && oz <= 2 ){
			rate = 0.65;
		}
		else if(oz > 2 && oz <= 3){
			rate = 0.80;
		}
		else if(oz > 3 && oz <= 3.5){
			rate = 0.95;
		}
		else{
			error = "Letters (Metered) can not weigh over 3.5 oz";
			console.log(error);
		}
	}
	else if (type == "Large Envelopes (Flats)"){
		if(oz > 13){
			error = "Envelopes can not weigh over 13 oz";
			console.log(error);
		}
		else{
			rate = (oz - 1)*.15 + 1.00;
			console.log(rate);
		}
	}
	else if (type == "First-Class Package"){
		if(oz <= 4){
			rate = 3.66;
		}
		else if(oz > 4 && oz <= 8 ){
			rate = 4.39;
		}
		else if(oz > 8 && oz <= 12 ){
			rate = 5.19;
		}
		else if(oz <= 13){
			rate = 5.71;
		}
		else{
			error = "First-Class packages can not weigh over 13 oz. ";
			console.log(error);

		}
	}
	const params = {weightOZ:oz, type:type, postage: rate.toFixed(2), error: error};
	res.render('pages/displayRate.ejs', params);
}