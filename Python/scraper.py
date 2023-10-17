import random
import requests
from bs4 import BeautifulSoup
from flask import jsonify
import time

SCRAPE_SIZE = 5
INGREDIENT_SIZE_MIN = 3
INGREDIENT_SIZE_MAX = 3
RECIPE_PER_PAGE = 10 #検索時1ページ当たりのレシピ数
ALTERNATIVE_SIZE = 5

def _get_active_recipe_url(seed_value=None):
    """
    有効な(削除されていない)レシピのURLを返す
    """
    url_prefix = "https://cookpad.com/recipe/"
    url = None

    """
    if not seed_value is None:
        random.seed(seed_value)
    """
    
    while True:
        tmp_idx = random.randrange(100000, 7641506)
        url = url_prefix + str(tmp_idx)

        res = requests.get(url)
        if res.status_code == 404:
            continue

        return url, res


def _is_valid_page(res, url):

    """
    与えられたurlをもとにダミーURLを取得する
    0: 正常
    1: 材料数不足
    2: 検索失敗
    3: ダミーレシピ数取得失敗
    4: ダミーレシピ数不足
    5: ダミー取得失敗
    """

    soup = BeautifulSoup(res.text, "html.parser")

    #タイトルチェック
    title = soup.select_one("#recipe-title > .recipe-title-and-myfoder > .recipe-title").get_text().strip()
    
    #材料が必要数を満たすか
    get_text = lambda tags: [tag.get_text() for tag in tags]
    names = get_text(soup.select("#ingredients_list > .ingredient_row > .ingredient_name"))
    quantities = get_text(soup.select("#ingredients_list > .ingredient_row > .ingredient_quantity"))

    if len(names) < INGREDIENT_SIZE_MIN:
        return 1, []
    

    #サーチ結果
    def _get_search_query(names):
        trancated_names = names[:min(INGREDIENT_SIZE_MAX, len(names))]
        ret_names = []

        #カッコが入ると検索結果が減るので取り除く
        for name in trancated_names:
            if "（" in name:
                ret_names.append(name.split("（")[0])
            elif "(" in name:
                ret_names.append(name.split("(")[0])
            else:
                ret_names.append(name)

        return "%20".join(map(lambda s: "材料："+s, ret_names))


    search_prefix = "https://cookpad.com/search/"
    search_query = _get_search_query(names)
    search_url = search_prefix + search_query
    search_res = requests.get(search_url)

    if search_res.status_code != 200:
        return 2, []
    
    search_soup = BeautifulSoup(search_res.text, "html.parser")


    #ダミーレシピ数
    try:
        #"〇〇品"
        recipe_nums_found_str = search_soup.select_one("#main > div.base_container > section > main > header > div > span").get_text().replace(",", "")
        
        #"〇〇" int
        recipe_nums_found = int(recipe_nums_found_str[:-1])

    except:
        return 3, []
    
    if recipe_nums_found < RECIPE_PER_PAGE:
        return 4, []
    
    title_list = [title]
    url_list = [url]

    #ダミーレシピ取得
    page_sum = min(1000, recipe_nums_found//RECIPE_PER_PAGE)
    page_idx = random.randrange(page_sum) + 1
    order = random.sample(range(RECIPE_PER_PAGE),RECIPE_PER_PAGE)
    
    further_search_url = search_url + "?page=" + str(page_idx)
    further_search_res = requests.get(further_search_url)
    assert further_search_res.status_code == 200
    further_search_soup = BeautifulSoup(further_search_res.text, "html.parser")

    for idx in order:

        if len(title_list) >= SCRAPE_SIZE:
            break

        query = "#recipe_" + str(idx) + " > div.recipe-text > div.recipe-header > div.recipe-title-and-author > h2 > a"
        dummy_html = further_search_soup.select_one(query)
        dummy_title = dummy_html.get_text()
        dummy_url = "https://cookpad.com" + dummy_html.get("href")
        
        if not dummy_title in title_list:
            title_list.append(dummy_title)
            url_list.append(dummy_url)

    if len(title_list) < SCRAPE_SIZE:
        return 5, []
    
    #スクレイピング成功！
    return 0, [title_list, url_list, names, quantities]

def scrape_alternative(seed_value=None):

    if not seed_value is None:
        random.seed(seed_value)
    

    ret = None
    cnt = 0
    while True:
        cnt += 1
        active_url, res = _get_active_recipe_url()
        code, ret = _is_valid_page(res, active_url)
        if code == 0:
            break
        print("ERR:", code)
    
    title_list, url_list, names, quantities = ret
    order = random.sample(range(SCRAPE_SIZE), SCRAPE_SIZE)
    ans = order.index(0)
    ans_title = title_list[0]
    ans_url = url_list[0]
    ans = min(ans, 4)

    ret_title_list = [title_list[idx] for idx in order[:ALTERNATIVE_SIZE-1]]
    ret_url_list = [url_list[idx] for idx in order[:ALTERNATIVE_SIZE-1]]

    #namesとquantitiesを同時ソート
    order = sorted(list(range(len(names))), key=lambda i:names[i])
    names = [names[i] for i in order]
    quantities = [quantities[i] for i in order]

    return {
        "title_list": ret_title_list,
        "url_list": ret_url_list,
        "names": names,
        "quantities": quantities,
        "answer": ans,
        "answer_title": ans_title,
        "answer_url": ans_url,
    }
        

def scrape(seed_value=None):

    url_prefix = "https://cookpad.com/recipe/"
    url = None

    if not seed_value is None:
        random.seed(seed_value)
    
    while True:
        tmp_idx = random.randrange(100000, 7641506)
        url = url_prefix + str(tmp_idx)

        res = requests.get(url)
        if res.status_code == 404:
            continue
        
        soup = BeautifulSoup(res.text, "html.parser")
        
        title = soup.select("#recipe-title > .recipe-title-and-myfoder > .recipe-title")

        if len(title) != 1:
            continue

        names = soup.select("#ingredients_list > .ingredient_row > .ingredient_name")
        quantities = soup.select("#ingredients_list > .ingredient_row > .ingredient_quantity")

        return {
            "title": title[0].get_text().strip(), 
            "url": url, 
            "ingredients": [{"name": name.get_text(), "quantity": quantity.get_text()} for name, quantity in zip(names, quantities)],
        }
    


if __name__ == "__main__":
    pass