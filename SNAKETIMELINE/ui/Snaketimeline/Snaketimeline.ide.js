TW.IDE.Widgets.Snaketimeline = function () {
    // this.widgetIconUrl = function () {
    //     return "http://localhost:8015/Thingworx/Common/thingworx/widgets/mashup/mashup.ide.png";
    // };

    this.widgetProperties = function () {
        var properties = {
            name: "Snaketimeline",
            description: "Snaketimeline Chart",
            category: ["Common"],
            isExtension: true,
            supportsAutoResize: true,
            properties: {
                ElementID: {
                    baseType: "STRING",
                    defaultValue: "0",
                    // isBindingTarget: true,
                    isBindingSource: true,
                },
                ValueUndone: {
                    baseType: "STRING",
                    defaultValue: "0",
                    // isBindingTarget: true,
                    isBindingSource: true,

                },

                StateFilter : {

                    baseType: "BOOLEAN",
                    isBindingTarget: true,
                },



                DataListText: {
                    baseType: "INFOTABLE",
                    isBindingSource: true,
                },


                DataSnakeTimeline: {
                    baseType: "INFOTABLE",
                    isBindingTarget: true,
                },

                Countbox: {
                    baseType: "NUMBER",
                    defaultValue: 1,
                },
                Countrow: {
                    baseType: "NUMBER",
                    defaultValue: 1,
                },
                HeightTimeline: {
                    baseType: "NUMBER",
                    defaultValue: 2000,
                },
                ImgforSettings : {
                    baseType: "STRING",
                    // isBindingTarget: true,
                    isBindingSource: true,
                    isBindingTarget: true,

                }
            },
        };

        return properties;
    };

    // The function is called before any property is updated in the ThingWorx Composer. You can perform validations on the new property value before it is committed. If the validation fails, you can return a message string to inform the user about the invalid input. The new property value is not be committed. If nothing is returned during the validation, then the value is assumed valid.
    this.beforeSetProperty = function (name, value) {};

    this.afterSetProperty = function (name, value) {
        this.updatedProperties();
        return true;
    };

    this.afterLoad = function () {};

    this.renderHtml = function () {
        return '<div class="widget-content widget-Snaketimeline"></div>';
    };

    this.afterRender = function () {

        console.log("widht screen detector after click", window.innerWidth)
        console.log("heiht screen detector after click", window.innerHeight)
        this.setProperty("ScreenWidth",  window.innerWidth);
        this.setProperty("ScreenHeight", window.innerHeight);
        try {
            var allWidgetProps = this.properties;

            var widgetProps = {};

            for (const [key, value] of Object.entries(allWidgetProps)) {
                if (key.includes("Style")) {
                    widgetProps[key] = TW.getStyleFromStyleDefinition(
                        this.getProperty(key)
                    );
                } else {
                    widgetProps[key] = this.getProperty(key);
                }
            }

            console.log("widgetProps running ScreenDetectorv2 after click");
            console.log(widgetProps);
        } catch (error) {
            console.log("error");
            console.log(error);
        }

        
        this.setupWidget();
    };

    this.setupWidget = function () {
        var widgetID = this.jqElementId;

        d3.select(`#${widgetID}`).selectAll("*").remove();
        // Handle Properties
        try {
            var allWidgetProps = this.allWidgetProperties().properties;

            var widgetProps = {};

            for (const [key, value] of Object.entries(allWidgetProps)) {
                if (key.includes("Style")) {
                    widgetProps[key] = TW.getStyleFromStyleDefinition(
                        this.getProperty(key)
                    );
                } else {
                    widgetProps[key] = this.getProperty(key);
                }
            }

            console.log("widgetProps idle snake timelane");
            console.log(widgetProps);
        } catch (error) {
            console.log("error");
            console.log(error);
        }

        var infotable = []

        var countbox = widgetProps.Countbox || 1 ;

        var countheadercontainer = Math.ceil(infotable.length / countbox);

        var header_body = d3
            .select(`#${widgetID}`)
            .append("div")
            .attr("class", "header-body")
            .style("width", 255 * countbox + 50 * 2 + 4 * 2 + 20 * 2 + "px")
            // // .style("width", "1180px")
            .style("overflow", "auto");

        for (let i = 0; i < countheadercontainer; i++) {
            var header_container = header_body
                .append("div")
                .attr("class", "header-container")
                .style("flex-direction", function () {
                    if (i % 2 !== 0) {
                        return "row-reverse";
                    } else {
                        return "row";
                    }
                });

            var isGenap = i % 2 == 0;

            var isDouble = infotable
                .slice(i * countbox, (i + 1) * countbox)
                .some((element) => element.value.length == 2);

            for (let j = i * countbox; j < (i + 1) * countbox; j++) {
                if (infotable[j]) {
                    if (isGenap) {
                        if (j == 0) {
                            line_horizontal_start_down(
                                header_container,
                                false,
                                false
                            );
                            line_add(header_container, false, false);
                        } else if (j % countbox == 0) {
                            line_horizontal_start_up(
                                header_container,
                                true,
                                infotable[j - 1].done
                            );
                            line_add(
                                header_container,
                                true,
                                infotable[j - 1].done
                            );
                        }
                    }

                    if (!isGenap) {
                        if (j % countbox == 0) {
                            line_horizontal_end_up(
                                header_container,
                                true,
                                infotable[j - 1].done
                            );
                            line_add(
                                header_container,
                                true,
                                infotable[j - 1].done
                            );
                        }
                    }

                    if (infotable[j].value.length > 1) {
                        makeMultipleContent(header_container, j, i);
                    } else if (infotable[j].value.length == 1) {
                        makeBoxContent(
                            header_container,
                            j,
                            i,
                            infotable[j].value[0]
                        );
                    } else {
                        makeSingleContent(header_container, j, i);
                    }

                    if (j != infotable.length - 1) {
                        if (isGenap) {
                            if (j == countbox - 1 + i * countbox) {
                                line_add(
                                    header_container,
                                    true,
                                    infotable[j].done
                                );

                                if (isDouble) {
                                    line_horizontal_end_down_2(
                                        header_container,
                                        true,
                                        infotable[j].done
                                    );
                                } else {
                                    line_horizontal_end_down(
                                        header_container,
                                        true,
                                        infotable[j].done
                                    );
                                }
                            }
                        }

                        if (!isGenap) {
                            if (j == countbox - 1 + i * countbox) {
                                line_add(
                                    header_container,
                                    true,
                                    infotable[j].done
                                );

                                if (isDouble) {
                                    line_horizontal_start_down_2(
                                        header_container,
                                        true,
                                        infotable[j].done
                                    );
                                } else {
                                    line_horizontal_start_down(
                                        header_container,
                                        true,
                                        infotable[j].done
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        function line_horizontal_start_up(header_container, opacity, coloring) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-start-up")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_horizontal_start_down_2(
            header_container,
            opacity,
            coloring
        ) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-start-down-2")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_horizontal_start_down(
            header_container,
            opacity,
            coloring
        ) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-start-down")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_horizontal_end_up(header_container, opacity, coloring) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-end-up")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_horizontal_end_down_2(
            header_container,
            opacity,
            coloring
        ) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-end-down-2")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_horizontal_end_down(header_container, opacity, coloring) {
            header_container
                .append("div")
                .attr("class", "line-horizontal-end-down")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#FFF";
                    }
                });
        }

        function line_add(header_container, opacity, coloring) {
            header_container
                .append("div")
                .attr("class", "line-add")
                .style("opacity", function () {
                    if (opacity) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .style("border-color", function () {
                    if (coloring) {
                        return "#E4551F";
                    } else {
                        return "#ffffff";
                    }
                });
        }

        function makeBoxContent(header_container, j, i, data) {
            //box-content
            var box_content = header_container
                .append("div")
                .attr("class", "box-content");

            var circle_header = box_content
                .append("div")
                .attr("class", "circle-header");

            circle_header
                .append("div")
                .attr("class", function () {
                    return "line-header-right";
                })
                .style("opacity", function () {
                    if (i % 2 !== 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 == 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });
            circle_header
                .append("div")
                .attr("class", "line-header-left")
                .style("opacity", function () {
                    if (i % 2 == 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 !== 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });

            var img_content = box_content
                .append("div")
                .attr("class", "img-content");

            img_content
                .append("img")
                .attr("class", "img-item")
                .attr(
                    "src",
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiI+DQogIDxkZWZzPg0KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+DQogICAgICA8aW1hZ2Ugd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZ0FBQUFJQUNBWUFBQUQwZU5UNkFBQUJoR2xEUTFCSlEwTWdjSEp2Wm1sc1pRQUFLSkY5a1QxSXcxQVVoVTlUdFVVcURuWVE2WkNoT3JVZ0t1SW9WU3lDaGRKV2FOWEI1S1YvME1TUXBMZzRDcTRGQjM4V3F3NHV6cm82dUFxQzRBK0lpNnVUb291VWVGOVNhQkhqZzh2N09PK2R3MzMzQVVLenhsU3paeHhRTmN2SUpCTml2ckFpQmw3Umh3aUNWREdKbVhvcXU1Q0Q1L3E2aDQvdmQzR2U1WDN2enpXZ0ZFMEcrRVRpV2FZYkZ2RTY4ZlNtcFhQZUp3NnppcVFRbnhQSERHcVErSkhyc3N0dm5Nc09Dend6Yk9ReWM4UmhZckhjeFhJWHM0cWhFazhSUnhWVm8zd2g3N0xDZVl1eldxdXpkcC84aGFHaXRwemxPbFVFU1N3aWhUUkV5S2lqaWhvc3hHblhTREdSb2ZPRWgzL0U4YWZKSlpPckNrYU9lV3hBaGVUNHdmL2c5MnpOMHVTRW14UktBTDB2dHYweENnUjJnVmJEdHIrUGJidDFBdmlmZ1N1dDQ5OW9Bak9mcERjNld2UUlHTndHTHE0N21yd0hYTzRBdzArNlpFaU81S2NTU2lYZy9ZeStxUUFNM1FMOXErN2MydWM0ZlFCeU5LdWxHK0RnRUJnclUvYWF4N3VEM1hQNzkwNTdmaitrZzNLN2YyVDFiUUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFBZDBTVTFGQitNR0hBZ21HQmNxbE1FQUFCTHlTVVJCVkhqYTdkM2JZZHRJRmdUUUJoLzZZNGV4Q1hBU1lPU1RnSnlBd21qOHJVUmhQN3dQelhodGl4SkZOcnJPaWNBQyt0NHFRQlE5RmVDL1dtdUxxekN1V3V2a0tzQjNHNWNBQUJRQUFFQUJBQUFVQUFCQUFRQUFGQUFBUUFFQUFCUUFBRUFCQUFBVUFBQkFBUUFBRkFBQVFBRUFBQlFBQUVBQkFBQVVBQUJBQVFBQUZBQUFVQUFBQUFVQUFGQUFBQUFGQUFCUUFBQUFCUUFBVUFBQUFBVUFBRkFBQUFBRkFBQlFBQUFBQlFBQVVBQUFBQVdBVWtwcmJYRVZBRHNGQlNCd1VBMHNZS2VnQUlTMmRBTUwyQ2tvQUdHRGFtQUJPd1VGSUhSUURTeGdwNkFBaEE2cWdRWHNGQlNBMEVFMXNJQ2RnZ0lRT3FnR0ZyQlRVQUJDQjlYQUFuWUtDa0Rvb0JwWXdFNUJBUWdkVkFNTDJDa29BS0dEYW1EQlRyRlRGQUJDQjlYQWdwMWlweWdBaEE2cWdRVTd4VTVSQUFnZFZBTUxkb3Fkb2dBUU9xZ0dGdXdVTzBVQklIUlFEU3pZS1hhS0FrRDRvQmhZc0ZQc0ZBV0EwQUV4c0dDbjJDa0tBS0dEa1RDd2o4Zmp2clcyV0U0WmM5WmFXeDZQeDcyZDR0K1ZibklKRE1SNzFGb24xNXhST2QrdXVRS0FRUjE0WUlVK3pybHJqUUpnVUVNR1Z1amp2THZHS0FBR05XUmdsMUkyYzJ0bnA0eHJPZFM2bVVycGVtYnRGQlFBNFI4N3NKNzJjZlpkVnhRQTRSOHlzRUlmTTJDbm9BQUkvNkNCRmZ5WUF6c0ZCVUQ0aHd6c1VzbzB0L2JxTk5HclczNVd3RTVCQVJEK3d3K3NwMzNNaEoyQ0FpRDhnd1pXOEdNdTdCUW5TQUVRL2tFREsvZ3hHMlpEQ1ZBQWhIL1F3QXAreklmNVVBSVVBT0VmTkxDdUYyYkVqQ2dCQ29Ed0R4cFkxd3JNaVJLZ0FBai9vSUYxbmNDc0tBRUtnUEFQR2xqWENNeUxFcUFBQ0g4QWxBQUZRUGdEb0FRb0FNSWZBQ1ZBQVJEK0FDZ0JDb0R3QjBBSlVBQ0VQd0JLZ0FJZy9BR1VBQlFBNFErZ0JLQUFDSDhBSlFBRlFQZ0RLQUVLQU1JZlFBbFFBSVMvcXdDZ0JDZ0F3aDhBSlVBQkVQNEFLQUVLZ1BBSFFBbFFBSVEvQUVxQUFpRDhBVkFDRkFEaEQ0QVNvQUFJZndDVUFBVkErQU9nQkNnQXdoOEFKVUFCRVA0QUtBRUtnUEFIUUFsUUFJUS9BRXFBQWlEOEFWQUNNZ3VBOEFkQUNRZ3JBTUlmQUNVZ3JBQUlmd0NVZ0xBQ0lQd0JVQUxDQ29Ed0IwQUpDQ3NBd2g4QUpTQ3NBQWgvQUpTQXNBSWcvQUZRQXNJS2dQQUhRQWtJS3dEQ0h3QWxJS3dBQ0g4QWxJQ3dBaUQ4QVZBQ3dncUE4QWRBQ1FnckFNSWZBQ1VnckFBSWZ3Q1VnTEFDSVB3QlVBTENDb0R3QjBBSkNDc0F3aDhBSlNDc0FBaC9BSlNBc0FJZy9BRlFBc0lLZ1BBSFFBa0lLd0RDSHdBbElLd0FDSDhBbElDd0FpRDhBVkFDd2dxQThBZEFDZkFHQUFDRWYwb0JVQUlBRVA2aEJVQUpBRUQ0aHhZQUpRQUE0UjlhQUpRQUFJUi9hQUZRQWdBUS9xRUZRQWtBUVBpSEZnQWxBQURoSDFvQWxBQUFoSDlvQVZBQ0FCRCtvUVZBQ1FCQStJY1dBQ1VBK2xrNFpoSFdHLzZyTEFBV0Q0a090ZTZtVXM1bUZJUi9kQUd3WUxCSXpDeVkyZEFDWUtGZ2VTZ0VZSDVEQzRBbHdob2RhdDFPcGJ5NkVtWVo0YThBV0J4WUZKaHB6TFFDWUdGZ1FXQzJNZHNLZ0VXQnhZQVp4NHdyQUJZRWZYazZuUjcrK1BidDJaVzRuYVdVemR6YTJaVkErQ3NBU2dDV2diY0NZTjdUQzRDbGdFV2dDSUNaRHkwQUZnTFh0TFp2NGt2bTF3TUlmd1ZBQ2VBYXdiK1pTbkdHMWxrRXByazEzN2VBOEU4dEFFb0FnbDhSVUFRUS9xRUZRQW5nZ3VEM0xYMktBTUkvSWh1alBzeWtCR0Rvc1Fld0J3SUxnT0ZIOEdNWFlCZUVGZ0NEaitESFBzQStDQzBBaGo2YjMvUHpkejRmSVB3VGYrN29KeUFsd0tDRG5XQW5wUDdzazRFMzhJWWM3QVY3UVFFdzdCaHlzQmZzQlFYQXNHUEFzUnRjQmJ0QkFURG9HSERzQnV3R0JjQ2cweHYvYWM5MXo3TmwrVDlMS2R1NXRSZFhRdmlQWXVjU1lMaFhIVXE3dWJYbmV4U0l0TEkxbFhJdXRVNGVFdkFHd05NU3d0OFovYkVVUlB3blNuYUZYYUVBR0dvTXREUHAzdUJNS2dDR0dZUHNMTHBmT0lzS2dDSEdBRHQvN2gvT253SmdlREc4enAzN2lYT25BQmhjUW9mV2VSdjMvcnEzenBvQ1lHQXhzTTVhNlAxMm41MHhCY0N3WWxDZHNkQjc3NTQ3VzJ1d0VmNFkwcTg3WDg1WTVyMnZ0VTVQcDlPRE95Z0R2QUZ3OC9tQVE2MzdxWlFYNTByNHI1V3ZEM2JPRkFCTG1zdkRmenVWOHVwTVdjb0RsSUROM0pyL244SjU2ODdHcmFmRDhOOEpmOHQ0b0tlczEwT3RkaTNlQUZqVy9DYjhWL1hhMzFrUy90NEVPSHZlQU1CMUdxbnd0NEJIUGR1dlBoaUlOd0NXTmlzT0FHZEkrRHMvenFFM0FDRDhzWFQ5dkNnQXZWdDg4WkdGS1B6ZGV6ODNQOCtJcUV5TSttSG4xbDRkY1l2d1VvL0g0MTc0QzBFL2YwUkdSSDFJYytlV1l3RjY2bmZ2NzNjZG5ESHV4UWR2RUFET2pIdnZyQkY0Um4wSUVNTmxJYnYzcmd1QklncUFaWTd6SXVUQUR2QUdBQ0VnL04xMzF3aHZBRndDTERqaEw5aGNLL0lNZjlnc2RZdk5PWEhmN1MyY1gyOEF1SU5EclYzL3VhbGxhM2wyT0ROMk13ckFaL2ptdno1TXBYVDc1UnJDWC9oM09qUE9wUXk1eFRrYmwrVXVDSndQOTl3T3cza09mQU9Bd2JGWTNYUFhFOElLZ0FYUHp5eStBbHRZZ1N6eEJvQzhNSmhiZTNhSGhMOXJpemNBRUxTd3ZCa1NVSzR4REZ3QUxIbWNDOEVFZG9jM0FBZ0U0Uy84WFc5UUFQZ3F2WC9oRDhMSWRZZUJDNEFudmZ2cDlRdC9uQWtoQlBhSU53Q0VoWUx3Ri83dUFTZ0FnT0FCUml3QWo4ZmozaTBWREo3K2hiLzdnWXo1dmFFT2tZVnZHVGtMd2liRlVzck9sMXFaQjI4QU1BeTR2MkdtVWw1Y0JUNTFoandwOFZHSFdqYzkvcmVsenJUd1QrSzg0dzBBOTNnQ3NYaUVQNkFBa1BiMDcybEkrSHZhZHI5UUFQRDBqL0FYL3FBQTRPbmZnaGIrWTRhL3R3QW9BSGo2Ui9oNzhnY0ZBRS8vbHJUd0YvNW1Fd1VBVC84SS8ySER2OGRpWURaUkFMQ29FZjdPRkNnQUNBemN5NVR3ZDE5UkFMQ3NFUkpmZko2Y1BSUUFoQWJ1b3pMcEhxTUFBSUpCK0lNQ3dBRDg2Wi93Ri83ck9vUCtKQkFGZ0t2dzUwWENYL2liV1JRQVFQZ0xmMUFBRUNDV3QzdVhIZjY5bmtYM0h3VUFoRC9LSXlnQUlQeUZQNkFBc01JZ3NjU0ZmMi9ueHE4QlVBQUF5MTVwQkFVQVFQaURBb0NuU1JEK1poa0ZBQ3gweGprcnppWUtBSUNpQ0FvQTYrT1ZJY0xmVEtNQUFBaC9VQUFBaEQ4b0FHREJ1ejUrZHZjQUJZRDE4N3RDaEwvWlJnRUFFUDZnQUFBSWYxQUFBSVEvS0FDc245OFJJdnpOT0FvQWdQQUhCUUR1YTNGVzR3TnlMVC9iVXNyT1NVUUJnQ3VaV3p1N0Nvck5Tczdxc3p1R0FnQVFGUDZnQUxBNlBoeUU4RGZyS0FBQXdoOFVBQURoRHdvQWdQQUhCUUFRb1A3dG9BQUFDSDlRQUFDRVB5Z0FkTW1mQlNIOHpUd0tBSUR3QndVQVFQaURBZ0FnL0VFQkFBU3M4QWNGQUw2TUR5MHBKczRxS0FDQThBYythZWNTd1BpQmUrK25VdUVQQ2dEUVdRQi9kVGtRL3FBQUFHSGxRUGlEQWdDRWxRUGhEd29BRUZZT2dQNzVLd0NBS3puVXVuY1ZVQURneXZ4OU5iMmJTbmx4RlZBQUFBQUZBQUJRQUFBQUJRQmczUTYxMnFjb0FQQlZmQkNRWGsybCtMTklGQUFBUUFFQUFCUUFnTEg0MVJRS0FGaTJBQW9BQUtBQUFBem42WFI2Y0JWUUFPQkcvQnFBWHZ6eDdkdXpxNEFDQUFBb0FBQWo4KzEvS0FCd0IzNE53TDM1OWo4VUFBQkFBV0JkV211cmZZcnhGZ0JuNzNKTEtlWUdCUUFnemR6YXE2dUFBZ0J3SVIvK1F3R0FEdmcxQUxmbXczOG9BQUI1VC84N1Z3RUZBTHdGSU8vcC8rd3FvQUFBQUFvQTY3WG1Qd1gwRmdCbkxHdldVUUFBYnVaUTY5NVZRQUVBVDJpRW1VcDVjUlZRQUFBVVMxQUF3TElHVUFCWXFaRStIS1FFNEN5TlBlTW9BQUNBQWdEZUF1QU1nUUpBUEYvYml2QUhCWUIzR08xM2hMNjJGYjU3UEI1OWp3Ri8zWTgrRkVMQ2s0OXpqaGt3QTNnRGdJVU96Z29LZ0VzQThKMnYrMFVCSU5xb3J3bzkyZkU3bzM3ZHI5Zi9LQURFVXdKd05rQUJ3S0lIWndJRkFONGEvWlhob2RhdHUweEMrSHY5andJQWIweWx2TG9LS0lJb0FPREpqekJQcDlPRElrajBnNURYUTZTSHBCbHd0a2UxbExLZFczdHh0L0VHQUx3SklPaWVDMzhVQUJBSXVOZWdBUEIrU2EvSEJZTjdiSFpSQUFDRVB5Z0FBR3YxZERvOUNILzRrYjhDd05QVEcrWmhMSWRhdDRsLzZ1Y2M4eDQ3bHdCUVdpR1BYd0hnaVFMaGIxWlJBQUNFUHlnQThNYmlWMFoweklmOVNsbnNkQzVnb2ZOdWMydlB4ZE1WbnZwN250R3pxNEEzQUlEd0J4UUFyc01Iak9ncCtJVy8yVVFCQUR6MUF3b0FualR3MUc4bTRWZDhDQkRvWHVvMytvRTNBSGppSVBxcFgvaWJSYndCQUlLQzMxV0FyelBVZ0duQ2xyUXo1RXg1K3NmNTlBYUFHMWhLMlhnOXkyY2RhdDFQcGJ5NEVoZk4zalM3REh6Q1VKOEJlRHFkSHR6UzIvTE5ZM3d5K0RmLy9oMi84TDk4OWhUdk94VFZrWDZlNFY2MWVTVjJINk84Rm5OK25CZm5sSlJ6NjFjQWdPVUpnZndaSUo1SUVQNW1EUVhBb2dHQWhHenhCZ0JQSm1ERzhBWUFMQ2d3V3lnQUsrWFhBQURJRkc4QThLUUNaZ29VQUN3c01Fc3diQUh3YXdBQVpJazNBSGh5QVRNRUtRWGdVS3VDWTRHQjJVR0dwQldBcVJRREJLek9NdUQvMHlKREZBQTh5UUMvNFgvNlF3RzRBaDhHVkFMQXJDQTd2QUhBWWdNekFnb0F0N2FVc25VVjRQL09objNjaWFmVDZTSGg1NHg1UGE1Wjk2UG5WMnZPU2Q0OWQvWklQYThhSnhZZG1Ba0N4UlFBVHlBV0hwZ0ZaSVUzQUZoOFlBYndCaUNGYndhMEFNSFpSMFlFRmdEZkROaW54K054N3lvZy9KRVJDZ0JoL3ZIbm4vLzBKMUNrV0VyWnVRb29BSGZndzRCOW1sczcrLzV6QXNKL21sdDdkaVZrZ3dJQWZ5MEJ2djhjWnh3VUFFMHZrZCtONG13akV4UUFMRXB3cGtFQjBQZ3NUSENXa1FVS0FCR0wwd2NEV2F1bGxFbjRvd0JvZm56UTNOcXJQeEZraGVHLzhZRS9HYUFBd09kTHdObVhCYkVXcmJWbGJ1M3NTdEE3VDhERjcrZzBkbWZCazViejQweDZBd0FXTERpYktBQ2FJQll0T0pOMnZnSUFGaTQ0aXlnQUdpSDNYcnorUW9CN1dVclpDbis3ZnMzOHIxU3MydHphdVJscTdsQStaNWNCYndBMFEvcFl5SzRDemhwMnZBS0F4UXpPR1B5Q05tUzROWDFud0pPWGMrRXNlZ01nL0hFL3dWbHlQeFVBQjRLVjMxZjNsbzk2UEI3M3pvK2RQN0xKUVhBUUVyejN0Wi96Y04vcmJ5L2dYQ29BaHB5N0RMd3prYjFvM1g5bk0wbnNyd0FNdXZzT3pnYko5MzF5dzlIOG5ZM2tweXozbk5RM0FYRS9zR0huVjRQdmZPUXNWL2VhOUJJUTlTc0FBOC9QenNYaUE3RWVCSEF1d3M3RjVNWUNLVTlXOWdEZUJJUVZBRU1QMlF2VkRrQUpDQ3dBQmg5eWw2bjVSd2tJTFFDR0h6SVhxZGxIQ1FndUFCWUE1QzFSYzQ4U0VGNEFMQUhJV2FEbUhTVkFBYkFNSUdoNW1uV1VBQVhBUW9DUXhXbkdVUUt1WjVndkFySVlZRXovK1c5NXpUaXl4aHNBNFErRFB6VXRwV3puMWw1Y09id0pVQUNFUHd5K0xNMHlTb0FDSVB3aFlGRXVwV3ptMXM2dURrcUFBaUQ4WWVBbGFXWlJBaFFBNFErQUVxQUFDSDhBbEFBRlFQZ0RvQVFvQU1JZkFDVWd0QUFJZndDVWdMQUNJUHdCVUFMQ0NvRHdCMEFKQ0NzQXdoOEFKU0NzQUFoL0FKU0FzQUlnL0FGUUFzSUtnUEFIUUFrSUt3RENId0FsSUt3QUNIOEFsSUN3QWlEOEFWQUN2QUVBQU9HZlVnQ1VBQUNFZjJnQlVBSUFFUDZoQlVBSkFFRDRoeFlBSlFBQTRSOWFBSlFBQUlSL2FBRlFBZ0FRL3FFRlFBa0FRUGlIRmdBbEFBRGhIMW9BbEFBQWhIOW9BVkFDQUJEK29RVkFDUUJBK0ljV0FDVUFBT0VmV2dDVUFBQ0VmMmdCVUFJQUVQNmhCVUFKQUVENGh4WUFKUUFBNFI5YUFKUUFBSVIvYUFGUUFnQVEvcUVGUUFrQVFQaUhGZ0FsQUFEaEgxb0FsQUFBaEg5b0FWQUNBQkQrb1FWQUNRQkErSWNXQUNVQUFPRWZXZ0NVQUFDRWYyZ0JVQUlBRVA2aEJVQUpBRUQ0aHhZQUpRQ0E5UENQTFFCS0FBREo0UjlkQUpRQUFGTERQNzRBS0FFQXdsOEJVQUlBRVA0S2dCSUFnUEJYQUpRQUFJUy9BcUFFQUNEOEZRQWxBQURocndBb0FRQUlmd1ZBQ1FCQStDc0FTZ0FBd2w4QlVBSUFFUDRLZ0JJQWdQQlhBSlFBQUlTL0FxQUVBQ0Q4RlFBbEFBRGhyd0FvQVFEQ0h3VkFDUUFRL2lnQVNnQ0E4RWNCVUFJQWhMOENnQkx3OVlQcUdvRjVFZjRLZ0JJUVBLaXVFNWdWNGE4QUtBSEJnK3BhZ1RrUi9ncUFFaEE4cUs0WFpzU01DSDhGUUFrSUhsUkxEdk5oUG9TL0FxQUVCQStxSW9EWk1CdkNYd0ZRQW9JSFZSSEFYTmdwVHBBQ29BUUVENm9pZ0ptd1UxQUFsSUR3UVZVRzZObWgxczFVeW1JV2hMOEN3UEFEZTY5QlZRUXdCM1lLQ29BU0VEeW9TeW5idWJVWEo0dlVHYkJUVUFDVWdQaEI5VllBWjk5MVJRRlFBc0lIVlJuZ21tNzV1MzA3QlFWQUNUQ29pZ0RPdTUyQ0FxQUVHRlJsQU9mY1RrRUJVQUlNcWpLQTgyMm5vQUFZV0lQNmNVc3B1N20xWjZjd3g2SFcvVlRLMEg4OVlxZWdBQmhZZytyTkFNNnplOEFQTmk2QndUQ29ZS2ZZS1FvQUJzU2dncDFpcHlnQUpBNktRUVU3eFU1UkFBZ2JHSU1LZG9xZG9nQVFOckFHRmV3VU8wVUJJR3hnRFNyWUtYYUtBa0RZd0JwVXNGUHNGQVdBc0lFMXFHQ24yQ2tLQUdFRGExREJUckZURkFEQ0J0YWdBbmFLQWtEWXdCcFV3RTVCQVFnYldJTUsyQ2tvQUdFRGExQUJPd1VGSUd4Z0RTcGdwNkFBaEEyc1FRWHNGQlNBc0lFMXFJQ2RnZ0lRTnJBR0ZiQlRVQURDQnRhZ0FuWUt2K0tHd2h1dHRjVlZ5SG1pQlc4QUFBQUZBQUJRQUFBQUJRQUFVQUFBQUFVQUFGQUFBQUFGQUFCUUFBQUFCUUFBVUFBQUFBVUFBRkFBQUFBRkFBQlFBQUFBQlFBQVVBQUFRQUVBQUJRQUFFQUJBQUFVQUFCQUFRQUFGQUFBUUFFQUFCUUFBRUFCQUFBVUFBQkFBUUFBRkFBQVFBRUFBQlFBQU9BaS93THNCWFo5eVRPdTNBQUFBQUJKUlU1RXJrSmdnZz09Ii8+DQogICAgPC9wYXR0ZXJuPg0KICA8L2RlZnM+DQogIDxyZWN0IGlkPSJlbmdpbmVlcjIiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjE2IiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+DQo8L3N2Zz4NCg=="
                )
                .on("click", function (d, i) {
                    console.log(data.id);

                    console.log("setting");
                });
            img_content
                .append("img")
                .attr("class", "img-item")
                .attr(
                    "src",
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOS4zMTciIGhlaWdodD0iMzMuMjA5IiB2aWV3Qm94PSIwIDAgMTkuMzE3IDMzLjIwOSI+DQogIDxnIGlkPSJHcm91cF8yMjM1IiBkYXRhLW5hbWU9Ikdyb3VwIDIyMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIj4NCiAgICA8cGF0aCBpZD0iUGF0aF8zMzIiIGRhdGEtbmFtZT0iUGF0aCAzMzIiIGQ9Ik0xNjEuMTM4LDIzNi4yNjhoLTkuNTcxYTEuNjYxLDEuNjYxLDAsMCwwLTEuNjU5LDEuNjU5djQuMjUxYTEuNjYxLDEuNjYxLDAsMCwwLDEuNjU5LDEuNjU5aDIuODg3bC0uNjgxLDYuNzc3YTIuNzQxLDIuNzQxLDAsMCwwLDAsLjUxOCwyLjU5MiwyLjU5MiwwLDEsMCw1LjE1Ny0uNTE4bC0uNjgxLTYuNzc3aDIuODg4YTEuNjYxLDEuNjYxLDAsMCwwLDEuNjU5LTEuNjU5di00LjI1MUExLjY2MSwxLjY2MSwwLDAsMCwxNjEuMTM4LDIzNi4yNjhabS0yLjc2OCw2LjAyNGEuNTMzLjUzMywwLDEsMSwuNTMzLS41MzNBLjUzMy41MzMsMCwwLDEsMTU4LjM3MSwyNDIuMjkyWm0yLjIyOCwwYS41MzMuNTMzLDAsMSwxLC41MzMtLjUzM0EuNTMzLjUzMywwLDAsMSwxNjAuNiwyNDIuMjkyWm0uNTMzLTIuNTY0YS41NDkuNTQ5LDAsMCwxLS41NS41NDloLTguNDZhLjU0OS41NDksMCwwLDEtLjU1LS41NDl2LTEuMzY2YS41NS41NSwwLDAsMSwuNTUtLjU0OWg4LjQ2YS41NS41NSwwLDAsMSwuNTUuNTQ5djEuMzY2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0Ni42OTUgLTIyMC4yNTUpIiBmaWxsPSIjZmZmIi8+DQogICAgPGcgaWQ9Ikdyb3VwXzY2MSIgZGF0YS1uYW1lPSJHcm91cCA2NjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuMTM0KSI+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzMiIGRhdGEtbmFtZT0iUGF0aCAzMzMiIGQ9Ik0xMzUuNjg2LDBIMTM0LjE1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2gxLjUzNmEuMTcuMTcsMCwwLDAsLjE3LS4xN1YuMTdBLjE3LjE3LDAsMCwwLDEzNS42ODYsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMzMuOTgpIiBmaWxsPSIjZmZmIi8+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzQiIGRhdGEtbmFtZT0iUGF0aCAzMzQiIGQ9Ik0xNzguMzk1LDBoLS42NWEuMTcuMTcsMCwwLDAtLjE3LjE3VjkuOTE5YS4xNy4xNywwLDAsMCwuMTcuMTdoLjY1YS4xNy4xNywwLDAsMCwuMTctLjE3Vi4xN0EuMTcuMTcsMCwwLDAsMTc4LjM5NSwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NC42MikiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNSIgZGF0YS1uYW1lPSJQYXRoIDMzNSIgZD0iTTIwNi45MjUsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwyMDYuOTI1LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjIxNykiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNiIgZGF0YS1uYW1lPSJQYXRoIDMzNiIgZD0iTTMwMS43ODIsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwzMDEuNzgyLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg5LjY0NSkiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNyIgZGF0YS1uYW1lPSJQYXRoIDMzNyIgZD0iTTI3NC45NjIsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwyNzQuOTYyLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY0LjY0MykiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzOCIgZGF0YS1uYW1lPSJQYXRoIDMzOCIgZD0iTTMzMC4wNTEsMGgtMS41MzZhLjE3LjE3LDAsMCwwLS4xNy4xN1Y5LjkxOWEuMTcuMTcsMCwwLDAsLjE3LjE3aDEuNTM2YS4xNy4xNywwLDAsMCwuMTctLjE3Vi4xN0EuMTcuMTcsMCwwLDAsMzMwLjA1MSwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMxNS4xNzIpIiBmaWxsPSIjZmZmIi8+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzkiIGRhdGEtbmFtZT0iUGF0aCAzMzkiIGQ9Ik0yMzYuNDY1LDBoLTEuNTM2YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2gxLjUzNmEuMTcuMTcsMCwwLDAsLjE3LS4xN1YuMTdBLjE3LjE3LDAsMCwwLDIzNi40NjUsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjcuOTI5KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvZz4NCiAgICA8cGF0aCBpZD0iUGF0aF8zNDAiIGRhdGEtbmFtZT0iUGF0aCAzNDAiIGQ9Ik0xMjEuMTI5LDE2Ny4zMTRhLjY3OS42NzksMCwwLDAtLjY3OS42Nzl2LjI5NGgtMTYuNnYtLjI5NGEuNjc5LjY3OSwwLDEsMC0xLjM1NywwdjEuOTQ1YS42NzkuNjc5LDAsMSwwLDEuMzU3LDB2LS4yOTRoMTYuNnYuMjk0YS42NzkuNjc5LDAsMCwwLDEuMzU3LDB2LTEuOTQ1QS42NzkuNjc5LDAsMCwwLDEyMS4xMjksMTY3LjMxNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDIuNDkxIC0xNTUuOTc1KSIgZmlsbD0iI2ZmZiIvPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                )
                .on("click", function (d, i) {
                    console.log(data.id);
                    console.log("undone");
                });

            box_content
                .append("div")
                .attr("class", "text-content")
                .text(data.text);
        }

        function makeMultipleContent(header_container, j, i) {
            var multiple_content = header_container
                .append("div")
                .attr("class", "multiple-content");

            multiple_content
                .append("div")
                .attr("class", "line-horizontal-left")
                .style("opacity", function () {
                    if (i % 2 == 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 !== 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });

            multiple_content
                .append("div")
                .attr("class", "line-horizontal-right")
                .style("opacity", function () {
                    if (i % 2 !== 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 == 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });
            makeBoxContent(multiple_content, j, i, infotable[j].value[0]);
            makeBoxContent(multiple_content, j, i, infotable[j].value[1]);
        }

        function makeSingleContent(header_container, j, i) {
            //box-content
            var box_content = header_container
                .append("div")
                .attr("class", "box-content");
            var circle_header = box_content
                .append("div")
                .attr("class", "circle-header")
                .style("background-color", "transparent");
            circle_header
                .append("div")
                .attr("class", function () {
                    return "line-header-right";
                })
                .style("opacity", function () {
                    if (i % 2 !== 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 == 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });
            circle_header
                .append("div")
                .attr("class", "line-header-left")
                .style("opacity", function () {
                    if (i % 2 == 0) {
                        if (j == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (j == infotable.length - 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    }
                })
                .style("border-color", function () {
                    if (i % 2 !== 0) {
                        if (infotable[j]) {
                            if (infotable[j].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    } else {
                        if (infotable[j - 1]) {
                            if (infotable[j - 1].done) {
                                return "#E4551F";
                            } else {
                                return "#FFF";
                            }
                        }
                    }
                });

            circle_header
                .append("div")
                .attr("class", "line-header-centre")
                .style("border-color", function () {
                    if (infotable[j]) {
                        if (infotable[j].done) {
                            return "#E4551F";
                        } else {
                            return "#FFF";
                        }
                    }
                });

            var img_content = box_content
                .append("div")
                .attr("class", "img-content")
                .style("opacity", 0);

            img_content
                .append("img")
                .attr("class", "img-item")
                .attr(
                    "src",
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiI+DQogIDxkZWZzPg0KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+DQogICAgICA8aW1hZ2Ugd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZ0FBQUFJQUNBWUFBQUQwZU5UNkFBQUJoR2xEUTFCSlEwTWdjSEp2Wm1sc1pRQUFLSkY5a1QxSXcxQVVoVTlUdFVVcURuWVE2WkNoT3JVZ0t1SW9WU3lDaGRKV2FOWEI1S1YvME1TUXBMZzRDcTRGQjM4V3F3NHV6cm82dUFxQzRBK0lpNnVUb291VWVGOVNhQkhqZzh2N09PK2R3MzMzQVVLenhsU3paeHhRTmN2SUpCTml2ckFpQmw3Umh3aUNWREdKbVhvcXU1Q0Q1L3E2aDQvdmQzR2U1WDN2enpXZ0ZFMEcrRVRpV2FZYkZ2RTY4ZlNtcFhQZUp3NnppcVFRbnhQSERHcVErSkhyc3N0dm5Nc09Dend6Yk9ReWM4UmhZckhjeFhJWHM0cWhFazhSUnhWVm8zd2g3N0xDZVl1eldxdXpkcC84aGFHaXRwemxPbFVFU1N3aWhUUkV5S2lqaWhvc3hHblhTREdSb2ZPRWgzL0U4YWZKSlpPckNrYU9lV3hBaGVUNHdmL2c5MnpOMHVTRW14UktBTDB2dHYweENnUjJnVmJEdHIrUGJidDFBdmlmZ1N1dDQ5OW9Bak9mcERjNld2UUlHTndHTHE0N21yd0hYTzRBdzArNlpFaU81S2NTU2lYZy9ZeStxUUFNM1FMOXErN2MydWM0ZlFCeU5LdWxHK0RnRUJnclUvYWF4N3VEM1hQNzkwNTdmaitrZzNLN2YyVDFiUUFBQUFaaVMwZEVBUDhBL3dEL29MMm5rd0FBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFBZDBTVTFGQitNR0hBZ21HQmNxbE1FQUFCTHlTVVJCVkhqYTdkM2JZZHRJRmdUUUJoLzZZNGV4Q1hBU1lPU1RnSnlBd21qOHJVUmhQN3dQelhodGl4SkZOcnJPaWNBQyt0NHFRQlE5RmVDL1dtdUxxekN1V3V2a0tzQjNHNWNBQUJRQUFFQUJBQUFVQUFCQUFRQUFGQUFBUUFFQUFCUUFBRUFCQUFBVUFBQkFBUUFBRkFBQVFBRUFBQlFBQUVBQkFBQVVBQUJBQVFBQUZBQUFVQUFBQUFVQUFGQUFBQUFGQUFCUUFBQUFCUUFBVUFBQUFBVUFBRkFBQUFBRkFBQlFBQUFBQlFBQVVBQUFBQVdBVWtwcmJYRVZBRHNGQlNCd1VBMHNZS2VnQUlTMmRBTUwyQ2tvQUdHRGFtQUJPd1VGSUhSUURTeGdwNkFBaEE2cWdRWHNGQlNBMEVFMXNJQ2RnZ0lRT3FnR0ZyQlRVQUJDQjlYQUFuWUtDa0Rvb0JwWXdFNUJBUWdkVkFNTDJDa29BS0dEYW1EQlRyRlRGQUJDQjlYQWdwMWlweWdBaEE2cWdRVTd4VTVSQUFnZFZBTUxkb3Fkb2dBUU9xZ0dGdXdVTzBVQklIUlFEU3pZS1hhS0FrRDRvQmhZc0ZQc0ZBV0EwQUV4c0dDbjJDa0tBS0dEa1RDd2o4Zmp2clcyV0U0WmM5WmFXeDZQeDcyZDR0K1ZibklKRE1SNzFGb24xNXhST2QrdXVRS0FRUjE0WUlVK3pybHJqUUpnVUVNR1Z1amp2THZHS0FBR05XUmdsMUkyYzJ0bnA0eHJPZFM2bVVycGVtYnRGQlFBNFI4N3NKNzJjZlpkVnhRQTRSOHlzRUlmTTJDbm9BQUkvNkNCRmZ5WUF6c0ZCVUQ0aHd6c1VzbzB0L2JxTk5HclczNVd3RTVCQVJEK3d3K3NwMzNNaEoyQ0FpRDhnd1pXOEdNdTdCUW5TQUVRL2tFREsvZ3hHMlpEQ1ZBQWhIL1F3QXAreklmNVVBSVVBT0VmTkxDdUYyYkVqQ2dCQ29Ed0R4cFkxd3JNaVJLZ0FBai9vSUYxbmNDc0tBRUtnUEFQR2xqWENNeUxFcUFBQ0g4QWxBQUZRUGdEb0FRb0FNSWZBQ1ZBQVJEK0FDZ0JDb0R3QjBBSlVBQ0VQd0JLZ0FJZy9BR1VBQlFBNFErZ0JLQUFDSDhBSlFBRlFQZ0RLQUVLQU1JZlFBbFFBSVMvcXdDZ0JDZ0F3aDhBSlVBQkVQNEFLQUVLZ1BBSFFBbFFBSVEvQUVxQUFpRDhBVkFDRkFEaEQ0QVNvQUFJZndDVUFBVkErQU9nQkNnQXdoOEFKVUFCRVA0QUtBRUtnUEFIUUFsUUFJUS9BRXFBQWlEOEFWQUNNZ3VBOEFkQUNRZ3JBTUlmQUNVZ3JBQUlmd0NVZ0xBQ0lQd0JVQUxDQ29Ed0IwQUpDQ3NBd2g4QUpTQ3NBQWgvQUpTQXNBSWcvQUZRQXNJS2dQQUhRQWtJS3dEQ0h3QWxJS3dBQ0g4QWxJQ3dBaUQ4QVZBQ3dncUE4QWRBQ1FnckFNSWZBQ1VnckFBSWZ3Q1VnTEFDSVB3QlVBTENDb0R3QjBBSkNDc0F3aDhBSlNDc0FBaC9BSlNBc0FJZy9BRlFBc0lLZ1BBSFFBa0lLd0RDSHdBbElLd0FDSDhBbElDd0FpRDhBVkFDd2dxQThBZEFDZkFHQUFDRWYwb0JVQUlBRVA2aEJVQUpBRUQ0aHhZQUpRQUE0UjlhQUpRQUFJUi9hQUZRQWdBUS9xRUZRQWtBUVBpSEZnQWxBQURoSDFvQWxBQUFoSDlvQVZBQ0FCRCtvUVZBQ1FCQStJY1dBQ1VBK2xrNFpoSFdHLzZyTEFBV0Q0a090ZTZtVXM1bUZJUi9kQUd3WUxCSXpDeVkyZEFDWUtGZ2VTZ0VZSDVEQzRBbHdob2RhdDFPcGJ5NkVtWVo0YThBV0J4WUZKaHB6TFFDWUdGZ1FXQzJNZHNLZ0VXQnhZQVp4NHdyQUJZRWZYazZuUjcrK1BidDJaVzRuYVdVemR6YTJaVkErQ3NBU2dDV2diY0NZTjdUQzRDbGdFV2dDSUNaRHkwQUZnTFh0TFp2NGt2bTF3TUlmd1ZBQ2VBYXdiK1pTbkdHMWxrRXByazEzN2VBOEU4dEFFb0FnbDhSVUFRUS9xRUZRQW5nZ3VEM0xYMktBTUkvSWh1alBzeWtCR0Rvc1Fld0J3SUxnT0ZIOEdNWFlCZUVGZ0NEaitESFBzQStDQzBBaGo2YjMvUHpkejRmSVB3VGYrN29KeUFsd0tDRG5XQW5wUDdzazRFMzhJWWM3QVY3UVFFdzdCaHlzQmZzQlFYQXNHUEFzUnRjQmJ0QkFURG9HSERzQnV3R0JjQ2cweHYvYWM5MXo3TmwrVDlMS2R1NXRSZFhRdmlQWXVjU1lMaFhIVXE3dWJYbmV4U0l0TEkxbFhJdXRVNGVFdkFHd05NU3d0OFovYkVVUlB3blNuYUZYYUVBR0dvTXREUHAzdUJNS2dDR0dZUHNMTHBmT0lzS2dDSEdBRHQvN2gvT253SmdlREc4enAzN2lYT25BQmhjUW9mV2VSdjMvcnEzenBvQ1lHQXhzTTVhNlAxMm41MHhCY0N3WWxDZHNkQjc3NTQ3VzJ1d0VmNFkwcTg3WDg1WTVyMnZ0VTVQcDlPRE95Z0R2QUZ3OC9tQVE2MzdxWlFYNTByNHI1V3ZEM2JPRkFCTG1zdkRmenVWOHVwTVdjb0RsSUROM0pyL244SjU2ODdHcmFmRDhOOEpmOHQ0b0tlczEwT3RkaTNlQUZqVy9DYjhWL1hhMzFrUy90NEVPSHZlQU1CMUdxbnd0NEJIUGR1dlBoaUlOd0NXTmlzT0FHZEkrRHMvenFFM0FDRDhzWFQ5dkNnQXZWdDg4WkdGS1B6ZGV6ODNQOCtJcUV5TSttSG4xbDRkY1l2d1VvL0g0MTc0QzBFL2YwUkdSSDFJYytlV1l3RjY2bmZ2NzNjZG5ESHV4UWR2RUFET2pIdnZyQkY0Um4wSUVNTmxJYnYzcmd1QklncUFaWTd6SXVUQUR2QUdBQ0VnL04xMzF3aHZBRndDTERqaEw5aGNLL0lNZjlnc2RZdk5PWEhmN1MyY1gyOEF1SU5EclYzL3VhbGxhM2wyT0ROMk13ckFaL2ptdno1TXBYVDc1UnJDWC9oM09qUE9wUXk1eFRrYmwrVXVDSndQOTl3T3cza09mQU9Bd2JGWTNYUFhFOElLZ0FYUHp5eStBbHRZZ1N6eEJvQzhNSmhiZTNhSGhMOXJpemNBRUxTd3ZCa1NVSzR4REZ3QUxIbWNDOEVFZG9jM0FBZ0U0Uy84WFc5UUFQZ3F2WC9oRDhMSWRZZUJDNEFudmZ2cDlRdC9uQWtoQlBhSU53Q0VoWUx3Ri83dUFTZ0FnT0FCUml3QWo4ZmozaTBWREo3K2hiLzdnWXo1dmFFT2tZVnZHVGtMd2liRlVzck9sMXFaQjI4QU1BeTR2MkdtVWw1Y0JUNTFoandwOFZHSFdqYzkvcmVsenJUd1QrSzg0dzBBOTNnQ3NYaUVQNkFBa1BiMDcybEkrSHZhZHI5UUFQRDBqL0FYL3FBQTRPbmZnaGIrWTRhL3R3QW9BSGo2Ui9oNzhnY0ZBRS8vbHJUd0YvNW1Fd1VBVC84SS8ySER2OGRpWURaUkFMQ29FZjdPRkNnQUNBemN5NVR3ZDE5UkFMQ3NFUkpmZko2Y1BSUUFoQWJ1b3pMcEhxTUFBSUpCK0lNQ3dBRDg2Wi93Ri83ck9vUCtKQkFGZ0t2dzUwWENYL2liV1JRQVFQZ0xmMUFBRUNDV3QzdVhIZjY5bmtYM0h3VUFoRC9LSXlnQUlQeUZQNkFBc01JZ3NjU0ZmMi9ueHE4QlVBQUF5MTVwQkFVQVFQaURBb0NuU1JEK1poa0ZBQ3gweGprcnppWUtBSUNpQ0FvQTYrT1ZJY0xmVEtNQUFBaC9VQUFBaEQ4b0FHREJ1ejUrZHZjQUJZRDE4N3RDaEwvWlJnRUFFUDZnQUFBSWYxQUFBSVEvS0FDc245OFJJdnpOT0FvQWdQQUhCUUR1YTNGVzR3TnlMVC9iVXNyT1NVUUJnQ3VaV3p1N0Nvck5Tczdxc3p1R0FnQVFGUDZnQUxBNlBoeUU4RGZyS0FBQXdoOFVBQURoRHdvQWdQQUhCUUFRb1A3dG9BQUFDSDlRQUFDRVB5Z0FkTW1mQlNIOHpUd0tBSUR3QndVQVFQaURBZ0FnL0VFQkFBU3M4QWNGQUw2TUR5MHBKczRxS0FDQThBYythZWNTd1BpQmUrK25VdUVQQ2dEUVdRQi9kVGtRL3FBQUFHSGxRUGlEQWdDRWxRUGhEd29BRUZZT2dQNzVLd0NBS3puVXVuY1ZVQURneXZ4OU5iMmJTbmx4RlZBQUFBQUZBQUJRQUFBQUJRQmczUTYxMnFjb0FQQlZmQkNRWGsybCtMTklGQUFBUUFFQUFCUUFnTEg0MVJRS0FGaTJBQW9BQUtBQUFBem42WFI2Y0JWUUFPQkcvQnFBWHZ6eDdkdXpxNEFDQUFBb0FBQWo4KzEvS0FCd0IzNE53TDM1OWo4VUFBQkFBV0JkV211cmZZcnhGZ0JuNzNKTEtlWUdCUUFnemR6YXE2dUFBZ0J3SVIvK1F3R0FEdmcxQUxmbXczOG9BQUI1VC84N1Z3RUZBTHdGSU8vcC8rd3FvQUFBQUFvQTY3WG1Qd1gwRmdCbkxHdldVUUFBYnVaUTY5NVZRQUVBVDJpRW1VcDVjUlZRQUFBVVMxQUF3TElHVUFCWXFaRStIS1FFNEN5TlBlTW9BQUNBQWdEZUF1QU1nUUpBUEYvYml2QUhCWUIzR08xM2hMNjJGYjU3UEI1OWp3Ri8zWTgrRkVMQ2s0OXpqaGt3QTNnRGdJVU96Z29LZ0VzQThKMnYrMFVCSU5xb3J3bzkyZkU3bzM3ZHI5Zi9LQURFVXdKd05rQUJ3S0lIWndJRkFONGEvWlhob2RhdHUweEMrSHY5andJQWIweWx2TG9LS0lJb0FPREpqekJQcDlPRElrajBnNURYUTZTSHBCbHd0a2UxbExLZFczdHh0L0VHQUx3SklPaWVDMzhVQUJBSXVOZWdBUEIrU2EvSEJZTjdiSFpSQUFDRVB5Z0FBR3YxZERvOUNILzRrYjhDd05QVEcrWmhMSWRhdDRsLzZ1Y2M4eDQ3bHdCUVdpR1BYd0hnaVFMaGIxWlJBQUNFUHlnQThNYmlWMFoweklmOVNsbnNkQzVnb2ZOdWMydlB4ZE1WbnZwN250R3pxNEEzQUlEd0J4UUFyc01Iak9ncCtJVy8yVVFCQUR6MUF3b0FualR3MUc4bTRWZDhDQkRvWHVvMytvRTNBSGppSVBxcFgvaWJSYndCQUlLQzMxV0FyelBVZ0duQ2xyUXo1RXg1K3NmNTlBYUFHMWhLMlhnOXkyY2RhdDFQcGJ5NEVoZk4zalM3REh6Q1VKOEJlRHFkSHR6UzIvTE5ZM3d5K0RmLy9oMi84TDk4OWhUdk94VFZrWDZlNFY2MWVTVjJINk84Rm5OK25CZm5sSlJ6NjFjQWdPVUpnZndaSUo1SUVQNW1EUVhBb2dHQWhHenhCZ0JQSm1ERzhBWUFMQ2d3V3lnQUsrWFhBQURJRkc4QThLUUNaZ29VQUN3c01Fc3diQUh3YXdBQVpJazNBSGh5QVRNRUtRWGdVS3VDWTRHQjJVR0dwQldBcVJRREJLek9NdUQvMHlKREZBQTh5UUMvNFgvNlF3RzRBaDhHVkFMQXJDQTd2QUhBWWdNekFnb0F0N2FVc25VVjRQL09objNjaWFmVDZTSGg1NHg1UGE1Wjk2UG5WMnZPU2Q0OWQvWklQYThhSnhZZG1Ba0N4UlFBVHlBV0hwZ0ZaSVUzQUZoOFlBYndCaUNGYndhMEFNSFpSMFlFRmdEZkROaW54K054N3lvZy9KRVJDZ0JoL3ZIbm4vLzBKMUNrV0VyWnVRb29BSGZndzRCOW1sczcrLzV6QXNKL21sdDdkaVZrZ3dJQWZ5MEJ2djhjWnh3VUFFMHZrZCtONG13akV4UUFMRXB3cGtFQjBQZ3NUSENXa1FVS0FCR0wwd2NEV2F1bGxFbjRvd0JvZm56UTNOcXJQeEZraGVHLzhZRS9HYUFBd09kTHdObVhCYkVXcmJWbGJ1M3NTdEE3VDhERjcrZzBkbWZCazViejQweDZBd0FXTERpYktBQ2FJQll0T0pOMnZnSUFGaTQ0aXlnQUdpSDNYcnorUW9CN1dVclpDbis3ZnMzOHIxU3MydHphdVJscTdsQStaNWNCYndBMFEvcFl5SzRDemhwMnZBS0F4UXpPR1B5Q05tUzROWDFud0pPWGMrRXNlZ01nL0hFL3dWbHlQeFVBQjRLVjMxZjNsbzk2UEI3M3pvK2RQN0xKUVhBUUVyejN0Wi96Y04vcmJ5L2dYQ29BaHB5N0RMd3prYjFvM1g5bk0wbnNyd0FNdXZzT3pnYko5MzF5dzlIOG5ZM2tweXozbk5RM0FYRS9zR0huVjRQdmZPUXNWL2VhOUJJUTlTc0FBOC9QenNYaUE3RWVCSEF1d3M3RjVNWUNLVTlXOWdEZUJJUVZBRU1QMlF2VkRrQUpDQ3dBQmg5eWw2bjVSd2tJTFFDR0h6SVhxZGxIQ1FndUFCWUE1QzFSYzQ4U0VGNEFMQUhJV2FEbUhTVkFBYkFNSUdoNW1uV1VBQVhBUW9DUXhXbkdVUUt1WjVndkFySVlZRXovK1c5NXpUaXl4aHNBNFErRFB6VXRwV3puMWw1Y09id0pVQUNFUHd5K0xNMHlTb0FDSVB3aFlGRXVwV3ptMXM2dURrcUFBaUQ4WWVBbGFXWlJBaFFBNFErQUVxQUFDSDhBbEFBRlFQZ0RvQVFvQU1JZkFDVWd0QUFJZndDVWdMQUNJUHdCVUFMQ0NvRHdCMEFKQ0NzQXdoOEFKU0NzQUFoL0FKU0FzQUlnL0FGUUFzSUtnUEFIUUFrSUt3RENId0FsSUt3QUNIOEFsSUN3QWlEOEFWQUN2QUVBQU9HZlVnQ1VBQUNFZjJnQlVBSUFFUDZoQlVBSkFFRDRoeFlBSlFBQTRSOWFBSlFBQUlSL2FBRlFBZ0FRL3FFRlFBa0FRUGlIRmdBbEFBRGhIMW9BbEFBQWhIOW9BVkFDQUJEK29RVkFDUUJBK0ljV0FDVUFBT0VmV2dDVUFBQ0VmMmdCVUFJQUVQNmhCVUFKQUVENGh4WUFKUUFBNFI5YUFKUUFBSVIvYUFGUUFnQVEvcUVGUUFrQVFQaUhGZ0FsQUFEaEgxb0FsQUFBaEg5b0FWQUNBQkQrb1FWQUNRQkErSWNXQUNVQUFPRWZXZ0NVQUFDRWYyZ0JVQUlBRVA2aEJVQUpBRUQ0aHhZQUpRQ0E5UENQTFFCS0FBREo0UjlkQUpRQUFGTERQNzRBS0FFQXdsOEJVQUlBRVA0S2dCSUFnUEJYQUpRQUFJUy9BcUFFQUNEOEZRQWxBQURocndBb0FRQUlmd1ZBQ1FCQStDc0FTZ0FBd2w4QlVBSUFFUDRLZ0JJQWdQQlhBSlFBQUlTL0FxQUVBQ0Q4RlFBbEFBRGhyd0FvQVFEQ0h3VkFDUUFRL2lnQVNnQ0E4RWNCVUFJQWhMOENnQkx3OVlQcUdvRjVFZjRLZ0JJUVBLaXVFNWdWNGE4QUtBSEJnK3BhZ1RrUi9ncUFFaEE4cUs0WFpzU01DSDhGUUFrSUhsUkxEdk5oUG9TL0FxQUVCQStxSW9EWk1CdkNYd0ZRQW9JSFZSSEFYTmdwVHBBQ29BUUVENm9pZ0ptd1UxQUFsSUR3UVZVRzZObWgxczFVeW1JV2hMOEN3UEFEZTY5QlZRUXdCM1lLQ29BU0VEeW9TeW5idWJVWEo0dlVHYkJUVUFDVWdQaEI5VllBWjk5MVJRRlFBc0lIVlJuZ21tNzV1MzA3QlFWQUNUQ29pZ0RPdTUyQ0FxQUVHRlJsQU9mY1RrRUJVQUlNcWpLQTgyMm5vQUFZV0lQNmNVc3B1N20xWjZjd3g2SFcvVlRLMEg4OVlxZWdBQmhZZytyTkFNNnplOEFQTmk2QndUQ29ZS2ZZS1FvQUJzU2dncDFpcHlnQUpBNktRUVU3eFU1UkFBZ2JHSU1LZG9xZG9nQVFOckFHRmV3VU8wVUJJR3hnRFNyWUtYYUtBa0RZd0JwVXNGUHNGQVdBc0lFMXFHQ24yQ2tLQUdFRGExREJUckZURkFEQ0J0YWdBbmFLQWtEWXdCcFV3RTVCQVFnYldJTUsyQ2tvQUdFRGExQUJPd1VGSUd4Z0RTcGdwNkFBaEEyc1FRWHNGQlNBc0lFMXFJQ2RnZ0lRTnJBR0ZiQlRVQURDQnRhZ0FuWUt2K0tHd2h1dHRjVlZ5SG1pQlc4QUFBQUZBQUJRQUFBQUJRQUFVQUFBQUFVQUFGQUFBQUFGQUFCUUFBQUFCUUFBVUFBQUFBVUFBRkFBQUFBRkFBQlFBQUFBQlFBQVVBQUFRQUVBQUJRQUFFQUJBQUFVQUFCQUFRQUFGQUFBUUFFQUFCUUFBRUFCQUFBVUFBQkFBUUFBRkFBQVFBRUFBQlFBQU9BaS93THNCWFo5eVRPdTNBQUFBQUJKUlU1RXJrSmdnZz09Ii8+DQogICAgPC9wYXR0ZXJuPg0KICA8L2RlZnM+DQogIDxyZWN0IGlkPSJlbmdpbmVlcjIiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjE2IiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+DQo8L3N2Zz4NCg=="
                );
            img_content
                .append("img")
                .attr("class", "img-item")
                .attr(
                    "src",
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOS4zMTciIGhlaWdodD0iMzMuMjA5IiB2aWV3Qm94PSIwIDAgMTkuMzE3IDMzLjIwOSI+DQogIDxnIGlkPSJHcm91cF8yMjM1IiBkYXRhLW5hbWU9Ikdyb3VwIDIyMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIj4NCiAgICA8cGF0aCBpZD0iUGF0aF8zMzIiIGRhdGEtbmFtZT0iUGF0aCAzMzIiIGQ9Ik0xNjEuMTM4LDIzNi4yNjhoLTkuNTcxYTEuNjYxLDEuNjYxLDAsMCwwLTEuNjU5LDEuNjU5djQuMjUxYTEuNjYxLDEuNjYxLDAsMCwwLDEuNjU5LDEuNjU5aDIuODg3bC0uNjgxLDYuNzc3YTIuNzQxLDIuNzQxLDAsMCwwLDAsLjUxOCwyLjU5MiwyLjU5MiwwLDEsMCw1LjE1Ny0uNTE4bC0uNjgxLTYuNzc3aDIuODg4YTEuNjYxLDEuNjYxLDAsMCwwLDEuNjU5LTEuNjU5di00LjI1MUExLjY2MSwxLjY2MSwwLDAsMCwxNjEuMTM4LDIzNi4yNjhabS0yLjc2OCw2LjAyNGEuNTMzLjUzMywwLDEsMSwuNTMzLS41MzNBLjUzMy41MzMsMCwwLDEsMTU4LjM3MSwyNDIuMjkyWm0yLjIyOCwwYS41MzMuNTMzLDAsMSwxLC41MzMtLjUzM0EuNTMzLjUzMywwLDAsMSwxNjAuNiwyNDIuMjkyWm0uNTMzLTIuNTY0YS41NDkuNTQ5LDAsMCwxLS41NS41NDloLTguNDZhLjU0OS41NDksMCwwLDEtLjU1LS41NDl2LTEuMzY2YS41NS41NSwwLDAsMSwuNTUtLjU0OWg4LjQ2YS41NS41NSwwLDAsMSwuNTUuNTQ5djEuMzY2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0Ni42OTUgLTIyMC4yNTUpIiBmaWxsPSIjZmZmIi8+DQogICAgPGcgaWQ9Ikdyb3VwXzY2MSIgZGF0YS1uYW1lPSJHcm91cCA2NjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuMTM0KSI+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzMiIGRhdGEtbmFtZT0iUGF0aCAzMzMiIGQ9Ik0xMzUuNjg2LDBIMTM0LjE1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2gxLjUzNmEuMTcuMTcsMCwwLDAsLjE3LS4xN1YuMTdBLjE3LjE3LDAsMCwwLDEzNS42ODYsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMzMuOTgpIiBmaWxsPSIjZmZmIi8+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzQiIGRhdGEtbmFtZT0iUGF0aCAzMzQiIGQ9Ik0xNzguMzk1LDBoLS42NWEuMTcuMTcsMCwwLDAtLjE3LjE3VjkuOTE5YS4xNy4xNywwLDAsMCwuMTcuMTdoLjY1YS4xNy4xNywwLDAsMCwuMTctLjE3Vi4xN0EuMTcuMTcsMCwwLDAsMTc4LjM5NSwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NC42MikiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNSIgZGF0YS1uYW1lPSJQYXRoIDMzNSIgZD0iTTIwNi45MjUsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwyMDYuOTI1LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjIxNykiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNiIgZGF0YS1uYW1lPSJQYXRoIDMzNiIgZD0iTTMwMS43ODIsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwzMDEuNzgyLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg5LjY0NSkiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzNyIgZGF0YS1uYW1lPSJQYXRoIDMzNyIgZD0iTTI3NC45NjIsMGgtLjY1YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2guNjVhLjE3LjE3LDAsMCwwLC4xNy0uMTdWLjE3QS4xNy4xNywwLDAsMCwyNzQuOTYyLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY0LjY0MykiIGZpbGw9IiNmZmYiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzMzOCIgZGF0YS1uYW1lPSJQYXRoIDMzOCIgZD0iTTMzMC4wNTEsMGgtMS41MzZhLjE3LjE3LDAsMCwwLS4xNy4xN1Y5LjkxOWEuMTcuMTcsMCwwLDAsLjE3LjE3aDEuNTM2YS4xNy4xNywwLDAsMCwuMTctLjE3Vi4xN0EuMTcuMTcsMCwwLDAsMzMwLjA1MSwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMxNS4xNzIpIiBmaWxsPSIjZmZmIi8+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zMzkiIGRhdGEtbmFtZT0iUGF0aCAzMzkiIGQ9Ik0yMzYuNDY1LDBoLTEuNTM2YS4xNy4xNywwLDAsMC0uMTcuMTdWOS45MTlhLjE3LjE3LDAsMCwwLC4xNy4xN2gxLjUzNmEuMTcuMTcsMCwwLDAsLjE3LS4xN1YuMTdBLjE3LjE3LDAsMCwwLDIzNi40NjUsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjcuOTI5KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvZz4NCiAgICA8cGF0aCBpZD0iUGF0aF8zNDAiIGRhdGEtbmFtZT0iUGF0aCAzNDAiIGQ9Ik0xMjEuMTI5LDE2Ny4zMTRhLjY3OS42NzksMCwwLDAtLjY3OS42Nzl2LjI5NGgtMTYuNnYtLjI5NGEuNjc5LjY3OSwwLDEsMC0xLjM1NywwdjEuOTQ1YS42NzkuNjc5LDAsMSwwLDEuMzU3LDB2LS4yOTRoMTYuNnYuMjk0YS42NzkuNjc5LDAsMCwwLDEuMzU3LDB2LTEuOTQ1QS42NzkuNjc5LDAsMCwwLDEyMS4xMjksMTY3LjMxNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDIuNDkxIC0xNTUuOTc1KSIgZmlsbD0iI2ZmZiIvPg0KICA8L2c+DQo8L3N2Zz4NCg=="
                );

            box_content
                .append("div")
                .attr("class", "text-content")
                .style("opacity", 0)
                .text("OPXXX OP Short Desc WCXXX WC Name WIP/SWIP X/X");
        }
    };

    this.widgetServices = function () {
        return {
            clickedEventFilter: {
                description: "clickedEventFilter",
            },

        };

    };

    this.widgetEvents = function () {
        return {
            SettingsTimeline: {
                description: "Event triggered when click Settings",
            },
           OverviewTimeline: {
                description: "Event triggered when click Settings",
            },
            UndoneTimeline: {
                description: "Event triggered when click undone",
            },
        };
    };
};
