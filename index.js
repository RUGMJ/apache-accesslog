import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

/* Reading the file and splitting it into an array of IPs. */
let ips = fs.readFileSync('/var/log/apache2/access.log').toString();
ips = ips.split('\n');
for (let i = 0; i < ips.length; i++) {
	ips[i] = ips[i].split(' ')[0];
}

/* Removing duplicates from the array. */
ips = ips.filter(function (elem, pos) {
	return ips.indexOf(elem) == pos;
});

/* Splitting the array of IPs into chunks of 100 because the api limits the amount of IPs per request. */
let requests = [];

for (let i = 0; i < ips.length; i += 100) {
	requests.push(ips.slice(i, i + 100));
}

/* Sending a request to the API for each chunk of 100 IPs. */
let responses = [];

for (let i = 0; i < requests.length; i++) {
	const request = requests[i];

	const response = await fetch('http://ip-api.com/batch', {
		method: 'POST',
		body: JSON.stringify(request),
	});

	responses.push(await response.json());
}

/* Flattening the array of arrays into a single array. */
responses = [].concat.apply([], responses);

/* Filtering the responses. */
const responseFiltered = responses.filter(e => true);

console.log(responseFiltered);
