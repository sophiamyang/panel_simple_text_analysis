importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");

function sendPatch(patch, buffers, msg_id) {
  self.postMessage({
    type: 'patch',
    patch: patch,
    buffers: buffers
  })
}

async function startApplication() {
  console.log("Loading pyodide!");
  self.postMessage({type: 'status', msg: 'Loading pyodide'})
  self.pyodide = await loadPyodide();
  self.pyodide.globals.set("sendPatch", sendPatch);
  console.log("Loaded!");
  await self.pyodide.loadPackage("micropip");
  const env_spec = ['https://cdn.holoviz.org/panel/0.14.0/dist/wheels/bokeh-2.4.3-py3-none-any.whl', 'https://cdn.holoviz.org/panel/0.14.0/dist/wheels/panel-0.14.0-py3-none-any.whl', 'pandas', 'requests', 'scikit-learn', 'textblob']
  for (const pkg of env_spec) {
    const pkg_name = pkg.split('/').slice(-1)[0].split('-')[0]
    self.postMessage({type: 'status', msg: `Installing ${pkg_name}`})
    await self.pyodide.runPythonAsync(`
      import micropip
      await micropip.install('${pkg}');
    `);
  }
  console.log("Packages loaded!");
  self.postMessage({type: 'status', msg: 'Executing code'})
  const code = `
  
import asyncio

from panel.io.pyodide import init_doc, write_doc

init_doc()

#!/usr/bin/env python
# coding: utf-8

# In[17]:


import panel as pn
import requests
import pandas as pd
from textblob import TextBlob
pn.extension()
pn.extension('tabulator')
import warnings
warnings.filterwarnings('ignore')


# In[18]:


sample_text = """
Happiness is a very complicated thing. Happiness can be used both in emotional or mental state context and can vary largely from a feeling from contentment to very intense feeling of joy. It can also mean a life of satisfaction, good well-being and so many more. Happiness is a very difficult phenomenon to use words to describe as it is something that can be felt only. Happiness is very important if we want to lead a very good life. Sadly, happiness is absent from the lives of a lot of people nowadays. We all have our own very different concept of happiness. Some of us are of the opinion that we can get happiness through money, others believe they can only get true happiness in relationships, some even feel that happiness can only be gotten when they are excelling in their profession.
As we might probably know, happiness is nothing more than the state of one being content and happy. A lot of people in the past, present and some (even in the future will) have tried to define and explain what they think happiness really is. So far, the most reasonable one is the one that sees happiness as something that can only come from within a person and should not be sought for outside in the world.
Some very important points about happiness are discussed below:
1. Happiness can’t be bought with Money:
A lot of us try to find happiness where it is not. We associate and equate money with happiness. If at all there is happiness in money then all of the rich people we have around us would never feel sad. What we have come to see is that even the rich amongst us are the ones that suffer depression, relationship problems, stress, fear and even anxiousness. A lot of celebrities and successful people have committed suicide, this goes a long way to show that money or fame does not guarantee happiness. This does not mean that it is a bad thing to be rich and go after money. When you have money, you can afford many things that can make you and those around you very happy.
2. Happiness can only come from within:
There is a saying that explains that one can only get true happiness when one comes to the realisation that only one can make himself/herself happy. We can only find true happiness within ourselves and we can’t find it in other people. This saying and its meaning is always hammered on in different places but we still refuse to fully understand it and put it into good use. It is very important that we understand that happiness is nothing more than the state of a person’s mind. Happiness cannot come from all the physical things we see around us. Only we through our positive emotions that we can get through good thoughts have the ability to create true happiness.
Our emotions are created by our thoughts. Therefore, it is very important that we work on having only positive thoughts and this can be achieved when we see life in a positive light."""


# In[30]:


# from nltk.corpus import stopwords
# stoplist = stopwords.words('english') + ['though']
stoplist = ['i',
 'me',
 'my',
 'myself',
 'we',
 'our',
 'ours',
 'ourselves',
 'you',
 "you're",
 "you've",
 "you'll",
 "you'd",
 'your',
 'yours',
 'yourself',
 'yourselves',
 'he',
 'him',
 'his',
 'himself',
 'she',
 "she's",
 'her',
 'hers',
 'herself',
 'it',
 "it's",
 'its',
 'itself',
 'they',
 'them',
 'their',
 'theirs',
 'themselves',
 'what',
 'which',
 'who',
 'whom',
 'this',
 'that',
 "that'll",
 'these',
 'those',
 'am',
 'is',
 'are',
 'was',
 'were',
 'be',
 'been',
 'being',
 'have',
 'has',
 'had',
 'having',
 'do',
 'does',
 'did',
 'doing',
 'a',
 'an',
 'the',
 'and',
 'but',
 'if',
 'or',
 'because',
 'as',
 'until',
 'while',
 'of',
 'at',
 'by',
 'for',
 'with',
 'about',
 'against',
 'between',
 'into',
 'through',
 'during',
 'before',
 'after',
 'above',
 'below',
 'to',
 'from',
 'up',
 'down',
 'in',
 'out',
 'on',
 'off',
 'over',
 'under',
 'again',
 'further',
 'then',
 'once',
 'here',
 'there',
 'when',
 'where',
 'why',
 'how',
 'all',
 'any',
 'both',
 'each',
 'few',
 'more',
 'most',
 'other',
 'some',
 'such',
 'no',
 'nor',
 'not',
 'only',
 'own',
 'same',
 'so',
 'than',
 'too',
 'very',
 's',
 't',
 'can',
 'will',
 'just',
 'don',
 "don't",
 'should',
 "should've",
 'now',
 'd',
 'll',
 'm',
 'o',
 're',
 've',
 'y',
 'ain',
 'aren',
 "aren't",
 'couldn',
 "couldn't",
 'didn',
 "didn't",
 'doesn',
 "doesn't",
 'hadn',
 "hadn't",
 'hasn',
 "hasn't",
 'haven',
 "haven't",
 'isn',
 "isn't",
 'ma',
 'mightn',
 "mightn't",
 'mustn',
 "mustn't",
 'needn',
 "needn't",
 'shan',
 "shan't",
 'shouldn',
 "shouldn't",
 'wasn',
 "wasn't",
 'weren',
 "weren't",
 'won',
 "won't",
 'wouldn',
 "wouldn't",
 'though']


# In[31]:


def get_sentiment(text):
    return pn.pane.Markdown(f"""
    Polarity (range from -1 negative to 1 positive): {TextBlob(text).polarity} \\n
    Subjectivity (range from 0 objective to 1 subjective): {TextBlob(text).subjectivity}
    """)


# In[32]:


def get_ngram(text):
    from sklearn.feature_extraction.text import CountVectorizer
    c_vec = CountVectorizer(stop_words=stoplist, ngram_range=(2,3))
    # matrix of ngrams
    try:
        ngrams = c_vec.fit_transform([text])
    except ValueError: # if less than 2 words, return empty result
        return pn.widgets.Tabulator(width=600)
    # count frequency of ngrams
    count_values = ngrams.toarray().sum(axis=0)
    # list of ngrams
    vocab = c_vec.vocabulary_
    df_ngram = pd.DataFrame(sorted([(count_values[i],k) for k,i in vocab.items()], reverse=True)
                ).rename(columns={0: 'frequency', 1:'bigram/trigram'})
    df_ngram['polarity'] = df_ngram['bigram/trigram'].apply(lambda x: TextBlob(x).polarity)
    df_ngram['subjective'] = df_ngram['bigram/trigram'].apply(lambda x: TextBlob(x).subjectivity)
    return pn.widgets.Tabulator(df_ngram, width=600, height=300)


# In[29]:


def get_ntopics(text, ntopics):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.decomposition import NMF
    from sklearn.pipeline import make_pipeline
    tfidf_vectorizer = TfidfVectorizer(stop_words=stoplist, ngram_range=(2,3))
    nmf = NMF(n_components=ntopics)
    pipe = make_pipeline(tfidf_vectorizer, nmf)
    try:
        pipe.fit([text])
    except ValueError: # if less than 2 words, return empty result
        return
    message = ""
    for topic_idx, topic in enumerate(nmf.components_):
        message += "####Topic #%d: " % topic_idx
        message += ", ".join([tfidf_vectorizer.get_feature_names()[i]
                             for i in topic.argsort()[:-3 - 1:-1]])
        message += "\\n"
    return pn.pane.Markdown(message)


# In[ ]:


explanation = pn.pane.Markdown("""
This app provides a simple text analysis for a given input text or text file. \\n
- Sentiment analysis uses [TextBlob](https://textblob.readthedocs.io/).
- N-gram analysis uses [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html) to see which words show up together.
- Topic modeling uses [scikit-learn](https://scikit-learn.org/stable/auto_examples/applications/plot_topics_extraction_with_nmf_lda.html) NMF model and we can change the number of topics we'd like to see in the result.
""")

def get_text_results(_):
    return pn.Column(
        explanation,
        pn.pane.Markdown("""
        ##Sentiment analysis:"""),
        get_sentiment(text_widget.value),
        pn.pane.Markdown("##N-gram analysis (bigram/trigram):"),
        get_ngram(text_widget.value),
        pn.pane.Markdown("##Topic modeling:"),
        get_ntopics(text_widget.value, ntopics_widget.value)
    )


# In[ ]:


button = pn.widgets.Button(name="Click me to run!")


# In[ ]:


file_input_widget = pn.widgets.FileInput()
def update_text_widget(event):
    text_widget.value = event.new.decode("utf-8")
# when the value of file_input_widget changes, 
# run this function to update the text of the text widget
file_input_widget.param.watch(update_text_widget, "value");


# In[ ]:


text_widget = pn.widgets.TextAreaInput(value=sample_text, height=300, name='Add text')


# In[ ]:


ntopics_widget = pn.widgets.IntSlider(name='Number of topics', start=2, end=10, step=1, value=3)


# In[ ]:


interactive = pn.bind(get_text_results, button)


# Layout using Template
template = pn.template.FastListTemplate(
    title='Simple Text Analysis', 
    sidebar=[
        button,
        ntopics_widget, 
        text_widget, 
        "Upload a text file",
        file_input_widget
    ],
    main=[pn.panel(interactive, loading_indicator=True)],
    accent_base_color="#88d8b0",
    header_background="#88d8b0",
)
template.servable()



await write_doc()
  `
  const [docs_json, render_items, root_ids] = await self.pyodide.runPythonAsync(code)
  self.postMessage({
    type: 'render',
    docs_json: docs_json,
    render_items: render_items,
    root_ids: root_ids
  });
}

self.onmessage = async (event) => {
  const msg = event.data
  if (msg.type === 'rendered') {
    self.pyodide.runPythonAsync(`
    from panel.io.state import state
    from panel.io.pyodide import _link_docs_worker

    _link_docs_worker(state.curdoc, sendPatch, setter='js')
    `)
  } else if (msg.type === 'patch') {
    self.pyodide.runPythonAsync(`
    import json

    state.curdoc.apply_json_patch(json.loads('${msg.patch}'), setter='js')
    `)
    self.postMessage({type: 'idle'})
  } else if (msg.type === 'location') {
    self.pyodide.runPythonAsync(`
    import json
    from panel.io.state import state
    from panel.util import edit_readonly
    if state.location:
        loc_data = json.loads("""${msg.location}""")
        with edit_readonly(state.location):
            state.location.param.update({
                k: v for k, v in loc_data.items() if k in state.location.param
            })
    `)
  }
}

startApplication()