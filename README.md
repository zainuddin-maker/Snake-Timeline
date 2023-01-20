
<h1 align="center"  style="font-weight:bold;" >
  <br>
  <!-- <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a> -->
  <br>
  Snake Timeline
  <br>
</h1>

> Data input from thingworx application .

<!-- <h4 align="center">A minimal Markdown Editor desktop app built on top of <a target="_blank">Electron</a>.</h4> -->

![screenshot](https://github.com/zainuddin-maker/Snake-Timeline/blob/master/test.gif?raw=true)


This application is used to generate snake timeline for terminal ,
why is this timeline called the snake timeline? because the timeline twists and turns like a snake , this time line generate from  data and the data from  thingworx platform .


## Usage example

<table>
<tr>
<td>


There are 3 click functions that are used in the snake timeline, the first function is when pressing the big circle in the middle, the color of this big circle is based on the status of the data obtained, the second function is when pressing the settings icon (icon to the right of the circle) and the last function is when pressing the undone icon (icon on the left), each function will output a value that can be parsed to the next application.


If in 1 terminal there is more than 1 asset then if pressed a pop up list of assets will appear in the terminal. and each function is the same as described above.

If there are more than 1 undone lists, a pop up will appear when pressed and has the same function as usual undone


Every pop up is automatic so it doesn't cross the limit of the given div container
<!-- ![Chat Preview](https://github.com/zainuddin-maker/Export5pageCustomtoPDF/blob/master/iconexport.PNG?raw=true) -->

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
- [html](https://www.w3schools.com/html/) - HTML is the standard markup language for Web pages.
- [css](https://www.w3schools.com/css/) - CSS is the language we use to style an HTML document














