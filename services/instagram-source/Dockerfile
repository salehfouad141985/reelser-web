FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --create-home source && mkdir /data && chown source:source /data
COPY source.py login.py ./
USER source
ENV INSTAGRAM_SESSION_FILE=/data/session.json SOURCE_HOST=0.0.0.0 PYTHONUNBUFFERED=1
EXPOSE 8010
CMD ["python", "source.py"]
