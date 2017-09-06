'use babel';
/*jshint esversion:6*/

import { CompositeDisposable } from 'atom';
import parseDOM from 'html-dom-parser';

export default {

  subscriptions: null,
  variableCounter: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html-to-js:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    console.log('HtmlToJs was toggled!');
    let parsed = this.getHtml();
    this.constructJS(parsed);
    return;
  },

  getHtml() {
    let editor = atom.workspace.getActiveTextEditor();
    let html = editor.getSelectedText();
    let parsedhtml = parseDOM(html);
    console.log(html);
    return parsedhtml;
  },

  constructJS(parsedhtml) {
    console.log(parsedhtml);
    let js_str = "{\n";
    this.variableCounter = {"div": 0};
    for(let i=0; i<parsedhtml.length; i++){
      js_str += this.parseTag(parsedhtml[i]);
      js_str += this.parseAttributes(parsedhtml[i].name, parsedhtml[i].attribs);
      this.variableCounter[parsedhtml[i].name]++;
    }
    js_str += "}\n";
    console.log(js_str);
  },

  parseTag(tagObject) {
    let parsedTag = "";
    let variableName = tagObject.name+'_'+this.variableCounter[tagObject.name];
    let tag = tagObject.name;
    parsedTag += `\tlet ${variableName} = document.createElement('${tag}');\n`;
    return parsedTag;
  },

  parseAttributes(element, attributes) {
    element = element + "_" + this.variableCounter[element];
    let parsedAttributes = "";
    for(let attr in attributes){
      parsedAttributes += `\t${element}.${attr} = "${attributes[attr]};"\n`;
    }
    return parsedAttributes;
  }

};
