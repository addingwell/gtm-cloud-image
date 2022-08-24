FROM launcher.gcr.io/google/nodejs

RUN install_node v12.x

# Copy application code.
COPY . /app/

# Install dependencies.
RUN npm --unsafe-perm install
