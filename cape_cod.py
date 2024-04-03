from flask import Flask, request, jsonify
import redis
import json

app = Flask(__name__)
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# API endpoint to fetch data from JSON files
@app.route('/api/data')
def get_data():
    category = request.args.get('category')
    cache_key = f'data:{category}'

    # Check if data is already in Redis cache
    cached_data = redis_client.get(cache_key)
    if cached_data:
        # If data is in cache, return it directly
        return jsonify(json.loads(cached_data))
    else:
        try:
            # If data is not in cache, fetch it from the JSON files
            file_path = f'data/{category}/{category}.json'
            with open(file_path, 'r') as file:
                data = json.load(file)

            # Store the fetched data in Redis cache with an expiration time (e.g., 1 hour)
            redis_client.setex(cache_key, 3600, json.dumps(data))

            # Return the fetched data to the client
            return jsonify(data)
        except FileNotFoundError:
            return jsonify({'error': 'Data not found'}), 404

if __name__ == '__main__':
    app.run()