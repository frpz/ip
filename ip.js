//
//Module de gestion d'adresses IP
//
// by Francis Pugnere

IP = {
	long2ip(ip) {
	  //  discuss at: http://phpjs.org/functions/this.long2ip/
	  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
	  //   example 1: this.long2ip( 3221234342 );
	  //   returns 1: '192.0.34.166'

	  if (!isFinite(ip))
		 return false;

	  return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
	},

	ip2long(IP) {
	  //  discuss at: http://phpjs.org/functions/this.ip2long/
	  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
	  // improved by: Victor
	  //  revised by: fearphage (http://http/my.opera.com/fearphage/)
	  //  revised by: Theriault
	  //   example 1: this.ip2long('192.0.34.166');
	  //   returns 1: 3221234342
	  //   example 2: this.ip2long('0.0xABCDEF');
	  //   returns 2: 11259375
	  //   example 3: this.ip2long('255.255.255.256');
	  //   returns 3: false

	  var i = 0;
	  // PHP allows decimal, octal, and hexadecimal IP components.
	  // PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
	  IP = IP.match(
		 /^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i
	  ); // Verify IP format.
	  if (!IP) {
		 // Invalid format.
		 return false;
	  }
	  // Reuse IP variable for component counter.
	  IP[0] = 0;
	  for (i = 1; i < 5; i += 1) {
		 IP[0] += !!((IP[i] || '')
			.length);
		 IP[i] = parseInt(IP[i]) || 0;
	  }
	  // Continue to use IP for overflow values.
	  // PHP does not allow any component to overflow.
	  IP.push(256, 256, 256, 256);
	  // Recalculate overflow of last component supplied to make up for missing components.
	  IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
	  if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
		 return false;
	  }
	  return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
	},

	inSubNet(ip, subnet) {   
		//inSubNet('192.30.252.63', '192.30.252.0/22') => true
		//inSubNet('192.31.252.63', '192.30.252.0/22') => false
		var mask, base_ip, long_ip = this.ip2long(ip);
		if( (mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip=this.ip2long(mask[1])) >= 0) ) {
			var freedom = Math.pow(2, 32 - parseInt(mask[2]));
			return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
		}
		else return false;
	},

	subAllIp(net, mask){
		var nb = Math.pow(2, 32 - parseInt(mask));
		if(nb == 1) return [net];
		if(nb == 2) return [net, (this.long2ip(this.ip2long(net) + 1))];
		//var list = [];
		var list = _.range(1,(nb - 1 )).map(v => this.long2ip(this.ip2long(net) + parseInt(v) ) );
		return list;
	},

	subBroadcast(net, mask){
		var nb = Math.pow(2, 32 - parseInt(mask));
		if(nb == 1) return net;
		return this.long2ip(this.ip2long(net) + parseInt(nb -1));
	},

	mask2bit(mask){
		//converti 255.255.255.0 en 24
		//return 32 - Math.log10(Math.pow(2,32) - this.ip2long(mask))/Math.log10(2);
		return 32 - Math.log(Math.pow(2,32) - this.ip2long(mask))/Math.LN2;
	},
	bit2mask(bit){
		//converti 24 en 255.255.255.0 
		return this.long2ip(Math.pow(2,32) - Math.pow(2,32 - bit) );
		//return this.long2ip((0xffffffff << (32 - bit)) >>> 0);
	}
}
