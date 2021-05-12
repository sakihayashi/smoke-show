import React, { Fragment } from 'react'

export const jsonLD2 = (props) =>{
    const { slug, pageName, publishedISO, timeISO } = props
    const data = `
            {
                "@context": "http://schema.org",
                "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                "url":"https://thesmokeshow.com/",
                "name":"The Smoke Show",
                "description":"",
                "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                "inLanguage":"en"},
                {"@type": "WebPage",
                "@id": "https://thesmokeshow.com/${slug}/#webpage", "url": "https://thesmokeshow.com/${slug}/", "name": "${pageName} | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "Look at all information about any car and have the results displayed in a way that's actually readable by a human. We didn't invent car search, we perfected it!", "breadcrumb":{"@id":"https://thesmokeshow.com/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/${slug}/"]}]},
                {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                "itemListElement":[{
                    "@type":"ListItem","position":1,
                    "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                    },
                    {
                        "@type":"ListItem",
                        "position":2,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${slug}/","url":"https://thesmokeshow.com/${slug}/","name":"${pageName}"}
                    }
                    ]}
                ]
            }
        `
    return data
}

export const jsonLD3 = (props) =>{
    const { slug, pageName, publishedISO, timeISO, list2, list3, list2Name } = props
    const data = 
            `
            {
                "@context": "http://schema.org",
                "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                "url":"https://thesmokeshow.com/",
                "name":"The Smoke Show",
                "description":"",
                "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                "inLanguage":"en"},
                {"@type": "WebPage",
                "@id": "https://thesmokeshow.com/${slug}/#webpage", "url": "https://thesmokeshow.com/${slug}/", "name": "${pageName} | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "Look at all information about any car and have the results displayed in a way that's actually readable by a human. We didn't invent car search, we perfected it!", "breadcrumb":{"@id":"https://thesmokeshow.com/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/${slug}/"]}]},
                {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                "itemListElement":[{
                    "@type":"ListItem","position":1,
                    "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                    },
                    {
                        "@type":"ListItem",
                        "position":2,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${list2}/","url":"https://thesmokeshow.com/${list2}/","name":"${list2Name}"}
                    },
                    {
                        "@type":"ListItem",
                        "position":3,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${list3}/","url":"https://thesmokeshow.com/${list3}/","name":"${pageName}"}
                    }
                    ]}
                ]
            }
        `
    return data
}

export const jsonLD4 = (props) =>{
    const { slug, pageName, publishedISO, timeISO, list2, list3, list4, list2Name, list3Name } = props
    const data = 
            `
            {
                "@context": "http://schema.org",
                "@graph": [{"@type":"WebSite","@id":"https://thesmokeshow.com/#website",
                "url":"https://thesmokeshow.com/",
                "name":"The Smoke Show",
                "description":"",
                "potentialAction":[{"@type":"SearchAction","target":"https://thesmokeshow.com/search?s={search_term_string}","query-input":"required name=search_term_string"}],
                "inLanguage":"en"},
                {"@type": "WebPage",
                "@id": "https://thesmokeshow.com/${slug}/#webpage", "url": "https://thesmokeshow.com/${slug}/", "name": "${pageName} | The Smoke Show","isPartOf":{"@id":"https://thesmokeshow.com/#website"}, "datePublished": "${publishedISO}", "dateModified": "${timeISO}", "description": "Look at all information about any car and have the results displayed in a way that's actually readable by a human. We didn't invent car search, we perfected it!", "breadcrumb":{"@id":"https://thesmokeshow.com/${slug}/#breadcrumb"},"inLanguage":"en","potentialAction":[{"@type":"ReadAction","target":["https://thesmokeshow.com/${slug}/"]}]},
                {"@type":"BreadcrumbList","@id":"https://thesmokeshow.com/#breadcrumb",
                "itemListElement":[{
                    "@type":"ListItem","position":1,
                    "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/","url":"https://thesmokeshow.com/","name":"Home"}
                    },
                    {
                        "@type":"ListItem",
                        "position":2,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${list2}/","url":"https://thesmokeshow.com/${list2}/","name":"${list2Name}"}
                    },
                    {
                        "@type":"ListItem",
                        "position":3,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${list2}/${list3}/","url":"https://thesmokeshow.com/${list2}/${list3}","name":"${list3Name}"}
                    },
                    {
                        "@type":"ListItem",
                        "position":3,
                        "item":{"@type":"WebPage","@id":"https://thesmokeshow.com/${list2}/${list3}/${list4}/","url":"https://thesmokeshow.com/${list2}/${list3}/${list4}/","name":"${pageName}"}
                    }
                    ]}
                ]
            }
        `
    return data
}