import requests
import json
import re

API_KEY = "667c02e3-50bf-4233-a954-b33d1264799a"

def remove_patterns(definition):
    # taking out the {bc} {sx} formatting around the words
    # function supplied by chatgpt
    patterns_to_remove = [r'\{bc\}', r'\{sx\|.*?\|\|\}']

    for pattern in patterns_to_remove:
        definition = re.sub(pattern, '', definition)

    return definition

def get_definitions(user_word, verbose = 0):
    # get word definition from dictionaryAPI
    res = requests.get(f"https://www.dictionaryapi.com/api/v3/references/collegiate/json/{user_word}?key={API_KEY}")
    # print(res.text)

    # convert the string to json
    res_json = json.loads(res.text)
    if res.status_code != 200:
        return "DictionaryAPI ran into an error. Try again"

    # iterate through the definitions by iterating through the items in the list
    # if verbose == 1:
    #     print(res_json[0]["def"][0]["sseq"])

    word_defs = []

    # print(res_json[0])

    if "def" in res_json[0]:
        for definition in res_json[0]["def"][0]["sseq"]:
            if verbose == 1:
                print(definition)
            # print(i[0][1])
            found_nested = False
            # for the time when they have several subdefinitions under a definition. 
            # see "run"
            while type(definition[0][1]) != dict:
                extra_defs = (definition[0][1])
                for nested_def in extra_defs:
                    if verbose == 1:
                        print(nested_def[1]['dt'][0][1])
                    cleaned_def = remove_patterns(nested_def[1]['dt'][0][1])
                    cleaned_def = cleaned_def.strip(' ,')
                    if cleaned_def != '':
                        word_defs.append(cleaned_def)
                found_nested = True
                break
            if found_nested == True:
                continue
            if 'dt' in definition[0][1]:
                if verbose == 1:
                    print(definition[0][1]['dt'][0][1])
                cleaned_def = remove_patterns(definition[0][1]['dt'][0][1])
                cleaned_def = cleaned_def.strip(' ,')
                if cleaned_def != '':
                    word_defs.append(cleaned_def)
    else:
        print(res_json[0])
    return word_defs

# testing: 
# print(get_definitions('run', verbose = 0))

# save file to json
res = get_definitions('run', verbose = 0)
with open ("run_definition.json", "w") as outfile:
    json.dump(res, outfile)

# definition one 
# print(res_json[0]["def"][0]["sseq"][0][0][1]['dt'][0][1])

# definition two
# print(res_json[0]["def"][0]["sseq"][1])
