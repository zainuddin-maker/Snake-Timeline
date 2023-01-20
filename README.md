
<h1 align="center"  style="font-weight:bold;" >
  <br>
  <!-- <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a> -->
  <br>
  Export data to PDF and Excell Template
  <br>
</h1>

> Data input from thingworx application .

<!-- <h4 align="center">A minimal Markdown Editor desktop app built on top of <a target="_blank">Electron</a>.</h4> -->

![screenshot](https://github.com/zainuddin-maker/ExporttoPDFandExcell/blob/master/test.gif?raw=true)


This application is used to generate documents in PDF and Excell file from data and the data from the thingworx platform


## Usage example

<table>
<tr>
<td>
Once the data is ready, just click on the button with img as below, and wait for a while, the browser will download the pdf

![Chat Preview](https://github.com/zainuddin-maker/Export5pageCustomtoPDF/blob/master/iconexport.PNG?raw=true)

</td>
</tr>
</table>


<!-- ## BIND DATA

1.  JSONDocinformation , input - JSON - Data for Doc Information in header

   
        {
            name: (STRING),
            value: (STRING),
        }



2.  JSONHeaderinformation, input - JSON - Data for Headerinformation in header.

       
        {
            name: (STRING),
            value: (STRING),
        }

3.  ConfigurationWidth, input - INFOTABLE - Configuration widht each of column in excel.

       
        {
            width: (STRING),
        }


4.  BooleanDisplayButton , input -BOOLEAN - Input for button seen or not 
5.  Filename , input - STRING - name of file after exported
6.  Headername , input - STRING - the title in template document.
4.  LabourProductivity , input - INFOTABLE - Data for Labour Productuvity

        {
            name: (STRING),
            value: (STRING),
            unit:  (STRING),
         }

5.  DataAddChangeMaintanance , input - INFOTABLE - List of Change of Maintanance .

        datashape :
        {
            changefrom : (DATE),
            idmaintanance : (NUMBER),
        }

6.  DataClickMaintanance , output - INFOABLE - Data out after click maintanance .

        datashape :
        {
            form : (DATE) ,
            to : (DATE),
            id : (STRING),
            idmaintanance : (NUMBER),
            imgstatus : (STRING),
            status : (STRING),
            text : (STRING),
        }

7.  idRandom , input - STRING - Random ID for Application
8.  HeightOfHeader , input - NUMBER - change height of header tittle

## BIND TRIGGER

1. clickMaintanance, out - "Event triggered when clicked the maintanance"
1. updateMaintanance, in - "Event triggered when maintanance updated"


 -->





## Built with 

- [D3.js](https://d3js.org/) - D3.js is a JavaScript library for manipulating documents based on data.
- [jspdf](https://www.npmjs.com/package/jspdf) - A library to generate PDFs in JavaScript.
- [html2canvas](https://www.npmjs.com/package/html2canvas) - The script allows you to take "screenshots" of webpages or parts of it, directly on the users browser.
- [html2pdf](https://www.npmjs.com/package/html2pdf.js/v/0.9.0) - html2pdf converts any webpage or element into a printable PDF entirely client-side using html2canvas and jsPDF.













