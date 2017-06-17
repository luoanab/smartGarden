# smartGarden

# For node app:
npm install rpio
npm install express-generator -g
express --hbs
npm install
npm start

#stop tracking node_modules
git rm -r node_modules
#create gitignore file
vi .gitignore >> insert node_modules




#for node js, run the script as root otherwise you get the following error:
bcm2835_init: Unable to open /dev/mem: Operation not permitted
/home/pi/node_modules/rpio/lib/rpio.js:363
        binding.rpio_init(Number(rpio_options.gpiomem));