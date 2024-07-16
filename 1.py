import requests

def get_bitcoin_price(currency):
    url = f"https://blockchain.info/ticker"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if currency in data:
            price = data[currency]["last"]
            return f"Price in {currency}: ${price}"
        else:
            return f"Currency '{currency}' not found."
    else:
        return "Failed to fetch data."

# Example usage:
currency_input = input("Enter the currency code (e.g., USD, EUR, GBP): ").strip().upper()
result = get_bitcoin_price(currency_input)

print(result)
