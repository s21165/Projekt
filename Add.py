Stock = {  # danę tutaj powinny być pobrane z barcode
    "Milk": 2,
    "Honey": 1,
    "Bear": 69,
    "Voodka": 0
}


def addProduct(a, b):
    if Stock[a] is not None:
        print("test")
        Stock[a] += b
    else:
        Stock[a] = b
    return Stock[a]


addProduct("Milk", 2)

for key, value in Stock.items():
    print(key, ':', value)
