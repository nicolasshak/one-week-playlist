import { responsePathAsArray } from "graphql";
import * as React from "react";
import { useState, useEffect } from "react";

function QueryStringToJSON() {            
    var pairs = window.location.search.slice(1).split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

const SubmitPage = () => {

    let url = new URL(window.location.href);
    let encodedState = url.searchParams.get("state");
    // Awkward bad URI decoding
    let code = url.searchParams.get("code");
    let state = JSON.parse(encodedState.replaceAll('+', ' '));

    useEffect(() => {
        fetch('https://dy7bo6uuul.execute-api.us-east-1.amazonaws.com/test', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: code,
                ...state
            })
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }, []);

    return(
        <main>
            <title>Logged In</title>
            <h1>Logged In!</h1>
        </main>
    )
}

export default SubmitPage